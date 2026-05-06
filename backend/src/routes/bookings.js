const express = require("express");
const { authenticate, authorize } = require("../middleware/auth");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

// Get bookings
router.get("/", authenticate, bookingController.getBookings);

// Create booking
router.post(
  "/",
  authenticate,
  authorize("customer", "wedding_planner"),
  bookingController.createBooking,
);

// Update booking status
router.put("/:id/status", authenticate, bookingController.updateBookingStatus);

module.exports = router;
