const Booking = require("../models/Booking");
const Event = require("../models/Event");
const User = require("../models/User");
const { z } = require("zod");

const createBookingSchema = z.object({
  eventId: z.string(),
  vendorId: z.string(),
  service: z.string(),
  bookingDate: z.string().transform((str) => new Date(str)),
  duration: z.number().min(1),
  pricing: z.object({
    baseRate: z.number().min(0),
    additionalFees: z
      .array(
        z.object({
          description: z.string(),
          amount: z.number(),
        }),
      )
      .optional(),
    currency: z.string().default("USD"),
    deposit: z
      .object({
        required: z.boolean().default(false),
        amount: z.number().optional(),
      })
      .optional(),
  }),
  requirements: z
    .object({
      description: z.string().optional(),
      specialRequests: z.string().optional(),
      equipment: z.array(z.string()).optional(),
      staffCount: z.number().optional(),
    })
    .optional(),
});

exports.createBooking = async (req, res) => {
  try {
    const validatedData = createBookingSchema.parse(req.body);
    const {
      eventId,
      vendorId,
      service,
      bookingDate,
      duration,
      pricing,
      requirements,
    } = validatedData;

    // Verify event exists and user has access
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (
      req.user.role === "customer" &&
      event.customerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Verify vendor exists and is available
    const vendor = await User.findOne({
      _id: vendorId,
      role: "vendor",
      isActive: true,
    });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found or inactive." });
    }

    // Check vendor availability (no double booking)
    const conflictingBooking = await Booking.findOne({
      vendorId,
      bookingDate: {
        $lt: new Date(bookingDate.getTime() + duration * 60 * 60 * 1000), // End time
        $gte: bookingDate,
      },
      status: { $in: ["confirmed", "in_progress"] },
    });

    if (conflictingBooking) {
      return res.status(409).json({
        message:
          "Vendor is not available at this time. Please choose a different time or vendor.",
        conflict: {
          bookingId: conflictingBooking._id,
          eventId: conflictingBooking.eventId,
          date: conflictingBooking.bookingDate,
        },
      });
    }

    // Calculate total amount
    const additionalFeesTotal =
      pricing.additionalFees?.reduce(
        (sum, fee) => sum + (fee.amount || 0),
        0,
      ) || 0;
    const totalAmount = pricing.baseRate + additionalFeesTotal;

    // Create booking
    const booking = new Booking({
      eventId,
      vendorId,
      customerId:
        req.user.role === "customer" ? req.user._id : event.customerId,
      service,
      bookingDate,
      duration,
      pricing: {
        ...pricing,
        totalAmount,
        additionalFees: pricing.additionalFees || [],
      },
      requirements: requirements || {},
    });

    await booking.save();

    // Populate response
    await booking.populate([
      { path: "eventId", select: "title date" },
      { path: "vendorId", select: "firstName lastName email" },
      { path: "customerId", select: "firstName lastName email" },
    ]);

    // Emit real-time update
    const io = req.app.get("io");
    io.to(`event-${eventId}`).emit("booking-created", booking);

    res.status(201).json({ booking });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error.", errors: error.errors });
    }
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, service } = req.query;
    let query = {};

    // Filter based on role
    if (req.user.role === "customer") {
      query.customerId = req.user._id;
    } else if (req.user.role === "vendor") {
      query.vendorId = req.user._id;
    }
    // Admin and planners see all

    if (status) query.status = status;
    if (service) query.service = service;

    const bookings = await Booking.find(query)
      .populate("eventId", "title date")
      .populate("vendorId", "firstName lastName email")
      .populate("customerId", "firstName lastName email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Check permissions
    const hasPermission =
      req.user.role === "admin" ||
      booking.customerId.toString() === req.user._id.toString() ||
      booking.vendorId.toString() === req.user._id.toString();

    if (!hasPermission) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Validate status transition
    const validStatuses = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    // Business logic for status changes
    if (status === "confirmed" && booking.status === "pending") {
      // Check availability again
      const conflict = await Booking.findOne({
        vendorId: booking.vendorId,
        bookingDate: booking.bookingDate,
        status: { $in: ["confirmed", "in_progress"] },
        _id: { $ne: booking._id },
      });

      if (conflict) {
        return res
          .status(409)
          .json({ message: "Vendor is no longer available." });
      }
    }

    booking.status = status;
    if (notes) {
      booking.notes.push({
        content: notes,
        createdBy: req.user._id,
        createdAt: new Date(),
      });
    }

    await booking.save();

    // Populate and emit update
    await booking.populate([
      { path: "eventId", select: "title date" },
      { path: "vendorId", select: "firstName lastName email" },
      { path: "customerId", select: "firstName lastName email" },
    ]);

    const io = req.app.get("io");
    io.to(`event-${booking.eventId}`).emit("booking-updated", booking);

    res.json({ booking });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Server error." });
  }
};
