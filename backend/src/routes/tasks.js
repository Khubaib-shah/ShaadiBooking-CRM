const express = require("express");
const { authenticate } = require("../middleware/auth");
const Task = require("../models/Task");

const router = express.Router();

// Get tasks
router.get("/", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, eventId } = req.query;
    let query = {};

    if (req.user.role === "customer") {
      // Customers see tasks for their events
      const Event = require("../models/Event");
      const userEvents = await Event.find({ customerId: req.user._id }).select(
        "_id",
      );
      query.eventId = { $in: userEvents.map((e) => e._id) };
    } else if (req.user.role === "vendor") {
      query.assignedTo = req.user._id;
    }
    // Admin and planners see all

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (eventId) query.eventId = eventId;

    const tasks = await Task.find(query)
      .populate("eventId", "title date")
      .populate("assignedTo", "firstName lastName")
      .populate("createdBy", "firstName lastName")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ dueDate: 1, priority: -1 });

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
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

// Create task
router.post("/", authenticate, async (req, res) => {
  try {
    const taskData = { ...req.body, createdBy: req.user._id };
    const task = new Task(taskData);
    await task.save();

    await task.populate(["eventId", "assignedTo", "createdBy"]);

    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
