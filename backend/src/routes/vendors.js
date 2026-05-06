const express = require("express");
const { authenticate } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Get vendors
router.get("/", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, service, search, location } = req.query;
    let query = { role: "vendor", isActive: true };

    if (service) {
      query["vendorDetails.services"] = service;
    }

    if (search) {
      query.$or = [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    if (location) {
      query["profile.location.city"] = new RegExp(location, "i");
    }

    const vendors = await User.find(query)
      .select("firstName lastName email profile vendorDetails")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ "vendorDetails.pricing.baseRate": 1 });

    const total = await User.countDocuments(query);

    res.json({
      vendors,
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

// Get vendor by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const vendor = await User.findOne({
      _id: req.params.id,
      role: "vendor",
    }).select("firstName lastName email profile vendorDetails");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    res.json({ vendor });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
