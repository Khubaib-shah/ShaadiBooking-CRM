/**
 * Event Service
 * ─────────────
 * Business logic for event (wedding) management.
 */
const Event = require("../models/Event");
const { AppError } = require("../middleware/errorHandler");
const cacheService = require("./cache.service");

const createEvent = async (data, requestingUser) => {
  const eventData = {
    ...data,
    customerId: requestingUser._id,
    date: new Date(data.date),
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  };

  const event = new Event(eventData);
  await event.save();
  await event.populate("customerId", "firstName lastName email");
  await cacheService.invalidatePattern("events:*");
  return event;
};

const getEvents = async (requestingUser, queryParams) => {
  const { page, limit, status, type, search } = queryParams;
  const query = {};

  if (requestingUser.role === "customer") {
    query.customerId = requestingUser._id;
  } else if (requestingUser.role === "wedding_planner") {
    query.$or = [
      { weddingPlannerId: requestingUser._id },
      { customerId: requestingUser._id },
    ];
  } else if (requestingUser.role === "vendor") {
    query["vendors.vendorId"] = requestingUser._id;
  }

  if (status) query.status = status;
  if (type) query.type = type;
  if (search) {
    const searchOr = [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
    ];
    if (query.$or) {
      query.$and = [{ $or: query.$or }, { $or: searchOr }];
      delete query.$or;
    } else {
      query.$or = searchOr;
    }
  }

  const cacheKey = `events:${requestingUser._id}:${JSON.stringify(queryParams)}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) return cached;

  const [events, total] = await Promise.all([
    Event.find(query)
      .populate("customerId", "firstName lastName email")
      .populate("weddingPlannerId", "firstName lastName email")
      .populate("vendors.vendorId", "firstName lastName email")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ date: -1 })
      .lean(),
    Event.countDocuments(query),
  ]);

  const result = {
    events,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };

  await cacheService.set(cacheKey, result, 120);
  return result;
};

const getEventById = async (eventId, requestingUser) => {
  const event = await Event.findById(eventId)
    .populate("customerId", "firstName lastName email")
    .populate("weddingPlannerId", "firstName lastName email")
    .populate("vendors.vendorId", "firstName lastName email")
    .lean();

  if (!event) {
    throw new AppError("Event not found.", 404, "EVENT_NOT_FOUND");
  }

  const hasAccess =
    requestingUser.role === "admin" ||
    event.customerId._id.toString() === requestingUser._id.toString() ||
    event.weddingPlannerId?._id?.toString() === requestingUser._id.toString() ||
    event.vendors.some(
      (v) => v.vendorId._id.toString() === requestingUser._id.toString()
    );

  if (!hasAccess) {
    throw new AppError("Access denied.", 403, "ACCESS_DENIED");
  }

  return event;
};

module.exports = { createEvent, getEvents, getEventById };
