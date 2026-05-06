/**
 * Booking Service
 * ───────────────
 * Core business logic for the booking lifecycle:
 *  - Creation with conflict detection
 *  - Status transitions with validation
 *  - Vendor double-booking prevention
 *
 * This is the heart of ShaadiBook's domain logic.
 */
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const User = require("../models/User");
const { AppError } = require("../middleware/errorHandler");
const { createNotification } = require("./notification.service");
const cacheService = require("./cache.service");

// ── Valid Status Transitions (state machine) ──
const STATUS_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["in_progress", "cancelled"],
  in_progress: ["completed", "disputed"],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
  disputed: ["confirmed", "cancelled"], // Resolved by admin
};

/**
 * Validates that a status transition is legal.
 * @param {string} currentStatus
 * @param {string} newStatus
 */
const validateStatusTransition = (currentStatus, newStatus) => {
  const allowed = STATUS_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(newStatus)) {
    throw new AppError(
      `Cannot transition booking from "${currentStatus}" to "${newStatus}". Allowed: ${(allowed || []).join(", ") || "none"}.`,
      400,
      "INVALID_STATUS_TRANSITION"
    );
  }
};

/**
 * Checks for conflicting bookings (double-booking prevention).
 * Uses date-range overlap detection.
 * @param {string} vendorId
 * @param {Date} bookingDate
 * @param {number} duration – in hours
 * @param {string} [excludeBookingId] – exclude a specific booking (for updates)
 * @returns {Promise<object|null>} The conflicting booking, or null
 */
const detectConflict = async (vendorId, bookingDate, duration, excludeBookingId) => {
  const startTime = new Date(bookingDate);
  const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

  const conflictQuery = {
    vendorId,
    status: { $in: ["confirmed", "in_progress"] },
    // Overlap detection: existing booking starts before our end AND ends after our start
    bookingDate: { $lt: endTime },
    $expr: {
      $gt: [
        {
          $add: [
            "$bookingDate",
            { $multiply: ["$duration", 60 * 60 * 1000] },
          ],
        },
        startTime,
      ],
    },
  };

  if (excludeBookingId) {
    conflictQuery._id = { $ne: excludeBookingId };
  }

  return Booking.findOne(conflictQuery).lean();
};

/**
 * Create a new booking with conflict detection.
 * @param {object} data – Validated booking data
 * @param {object} requestingUser – The authenticated user
 * @returns {Promise<object>}
 */
const createBooking = async (data, requestingUser) => {
  // 1. Verify the event exists and user has access
  const event = await Event.findById(data.eventId);
  if (!event) {
    throw new AppError("Event not found.", 404, "EVENT_NOT_FOUND");
  }

  if (
    requestingUser.role === "customer" &&
    event.customerId.toString() !== requestingUser._id.toString()
  ) {
    throw new AppError("You do not have access to this event.", 403, "ACCESS_DENIED");
  }

  // 2. Verify the vendor exists and is active
  const vendor = await User.findOne({
    _id: data.vendorId,
    role: "vendor",
    isActive: true,
  });
  if (!vendor) {
    throw new AppError("Vendor not found or inactive.", 404, "VENDOR_NOT_FOUND");
  }

  // 3. Check for conflicts (race-condition-safe with atomic check)
  const bookingDate = new Date(data.bookingDate);
  const conflict = await detectConflict(data.vendorId, bookingDate, data.duration);
  if (conflict) {
    throw new AppError(
      "Vendor is already booked during this time slot. Choose a different time or vendor.",
      409,
      "VENDOR_CONFLICT"
    );
  }

  // 4. Calculate total amount
  const additionalFeesTotal = (data.pricing.additionalFees || []).reduce(
    (sum, fee) => sum + (fee.amount || 0),
    0
  );
  const totalAmount = data.pricing.baseRate + additionalFeesTotal;

  // 5. Create the booking
  const booking = new Booking({
    ...data,
    bookingDate,
    customerId:
      requestingUser.role === "customer"
        ? requestingUser._id
        : event.customerId,
    pricing: {
      ...data.pricing,
      totalAmount,
      additionalFees: data.pricing.additionalFees || [],
    },
  });

  await booking.save();

  // 6. Populate for response
  await booking.populate([
    { path: "eventId", select: "title date" },
    { path: "vendorId", select: "firstName lastName email" },
    { path: "customerId", select: "firstName lastName email" },
  ]);

  // 7. Notify the vendor about the new booking
  await createNotification({
    recipientId: data.vendorId,
    type: "booking_created",
    title: "New Booking Request",
    message: `You have a new booking request for ${data.service} on ${bookingDate.toLocaleDateString()}.`,
    relatedEntity: { kind: "Booking", id: booking._id },
  });

  // 8. Invalidate relevant caches
  await cacheService.invalidatePattern("bookings:*");

  return booking;
};

/**
 * Transition a booking's status with business rule enforcement.
 * @param {string} bookingId
 * @param {{ status: string, notes?: string }} data
 * @param {object} requestingUser
 * @returns {Promise<object>}
 */
const updateBookingStatus = async (bookingId, data, requestingUser) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError("Booking not found.", 404, "BOOKING_NOT_FOUND");
  }

  // Permission check
  const isOwner =
    booking.customerId.toString() === requestingUser._id.toString() ||
    booking.vendorId.toString() === requestingUser._id.toString();

  if (requestingUser.role !== "admin" && !isOwner) {
    throw new AppError("You do not have permission to update this booking.", 403, "ACCESS_DENIED");
  }

  // Validate the state transition
  validateStatusTransition(booking.status, data.status);

  // Re-check for conflicts when confirming
  if (data.status === "confirmed") {
    const conflict = await detectConflict(
      booking.vendorId.toString(),
      booking.bookingDate,
      booking.duration,
      booking._id.toString()
    );

    if (conflict) {
      throw new AppError(
        "Vendor is no longer available for this time slot.",
        409,
        "VENDOR_CONFLICT"
      );
    }
  }

  // Update status
  booking.status = data.status;

  // Append notes if provided
  if (data.notes) {
    booking.notes.push({
      content: data.notes,
      createdBy: requestingUser._id,
      createdAt: new Date(),
    });
  }

  await booking.save();

  await booking.populate([
    { path: "eventId", select: "title date" },
    { path: "vendorId", select: "firstName lastName email" },
    { path: "customerId", select: "firstName lastName email" },
  ]);

  // Notify relevant parties
  const notifyTarget =
    requestingUser._id.toString() === booking.vendorId._id.toString()
      ? booking.customerId._id.toString()
      : booking.vendorId._id.toString();

  await createNotification({
    recipientId: notifyTarget,
    type: "booking_updated",
    title: "Booking Status Updated",
    message: `Booking for ${booking.service} has been updated to "${data.status}".`,
    relatedEntity: { kind: "Booking", id: booking._id },
  });

  await cacheService.invalidatePattern("bookings:*");

  return booking;
};

/**
 * Get paginated bookings with role-based filtering.
 * @param {object} requestingUser
 * @param {{ page: number, limit: number, status?: string, service?: string }} queryParams
 * @returns {Promise<{ bookings: object[], pagination: object }>}
 */
const getBookings = async (requestingUser, queryParams) => {
  const { page, limit, status, service } = queryParams;
  const query = {};

  // Role-based scoping
  if (requestingUser.role === "customer") {
    query.customerId = requestingUser._id;
  } else if (requestingUser.role === "vendor") {
    query.vendorId = requestingUser._id;
  }
  // Admin and wedding_planner see all

  if (status) query.status = status;
  if (service) query.service = service;

  // Try cache first
  const cacheKey = `bookings:${requestingUser._id}:${JSON.stringify(queryParams)}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) return cached;

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate("eventId", "title date")
      .populate("vendorId", "firstName lastName email")
      .populate("customerId", "firstName lastName email")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .lean(),
    Booking.countDocuments(query),
  ]);

  const result = {
    bookings,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };

  await cacheService.set(cacheKey, result, 120); // 2 min cache
  return result;
};

module.exports = { createBooking, updateBookingStatus, getBookings, detectConflict };
