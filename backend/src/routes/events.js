const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const Event = require("../models/Event");

const router = express.Router();

// Get events for current user
router.get("/", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, search } = req.query;
    let query = {};

    // Filter based on role
    if (req.user.role === "customer") {
      query.customerId = req.user._id;
    } else if (req.user.role === "wedding_planner") {
      query.$or = [
        { weddingPlannerId: req.user._id },
        { customerId: req.user._id }, // If planner is also customer
      ];
    } else if (req.user.role === "vendor") {
      // Vendors see events they're assigned to
      query.vendors = { $elemMatch: { vendorId: req.user._id } };
    }
    // Admin sees all

    if (status) query.status = status;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    const events = await Event.find(query)
      .populate("customerId", "firstName lastName email")
      .populate("weddingPlannerId", "firstName lastName email")
      .populate("vendors.vendorId", "firstName lastName email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 });

    const total = await Event.countDocuments(query);

    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// Create event
router.post(
  "/",
  authenticate,
  authorize("customer", "wedding_planner"),
  async (req, res) => {
    try {
      const eventData = { ...req.body, customerId: req.user._id };
      const event = new Event(eventData);
      await event.save();

      await event.populate("customerId", "firstName lastName email");

      res.status(201).json({ event });
    } catch (error) {
      res.status(500).json({ message: "Server error." });
    }
  },
);

// Get event by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("customerId", "firstName lastName email")
      .populate("weddingPlannerId", "firstName lastName email")
      .populate("vendors.vendorId", "firstName lastName email");

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check permissions
    const hasAccess =
      req.user.role === "admin" ||
      event.customerId._id.toString() === req.user._id.toString() ||
      event.weddingPlannerId?._id.toString() === req.user._id.toString() ||
      event.vendors.some(
        (v) => v.vendorId._id.toString() === req.user._id.toString(),
      );

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
