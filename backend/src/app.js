/**
 * Express Application Setup
 * ─────────────────────────
 * Pure Express configuration: security middlewares, route mounting,
 * and global error handling. No HTTP listen — that's server.js's job.
 *
 * Pattern: app.js (config) → server.js (boot)
 */
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const env = require("./config/environment");

// ── Middleware Imports ──
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

// ── Route Imports ──
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/bookings");
const vendorRoutes = require("./routes/vendors");
const paymentRoutes = require("./routes/payments");
const taskRoutes = require("./routes/tasks");

const app = express();

// ────────────────────────────────────────────────────
// Security Middlewares
// ────────────────────────────────────────────────────

// Helmet sets various HTTP headers to prevent common attacks
app.use(helmet());

// CORS — only allow the configured frontend origin
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing with a sensible size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ────────────────────────────────────────────────────
// Rate Limiting
// ────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },
});
app.use(globalLimiter);

// Stricter limiter for authentication endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again in 15 minutes.",
  },
});

// ────────────────────────────────────────────────────
// Health Check (no auth required)
// ────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ────────────────────────────────────────────────────
// API Routes
// ────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tasks", taskRoutes);

// ────────────────────────────────────────────────────
// Error Handling (must be LAST middleware)
// ────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
