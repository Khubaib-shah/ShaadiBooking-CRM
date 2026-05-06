const express = require("express");
const { authenticate } = require("../middleware/auth");
const authController = require("../controllers/authController");

const router = express.Router();

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Get current user profile
router.get("/profile", authenticate, authController.getProfile);

// Update profile
router.put("/profile", authenticate, authController.updateProfile);

module.exports = router;
