const express = require("express");
const { authenticate } = require("../middleware/auth");
const Payment = require("../models/Payment");

const router = express.Router();

// Get payments
router.get("/", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    let query = {};

    if (req.user.role === "customer") {
      query.payerId = req.user._id;
    } else if (req.user.role === "vendor") {
      query.payeeId = req.user._id;
    }
    // Admin sees all

    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate("bookingId", "service")
      .populate("payerId", "firstName lastName")
      .populate("payeeId", "firstName lastName")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
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

module.exports = router;
