/**
 * Centralized Error Handler
 * ─────────────────────────
 * Catches all thrown/next'd errors and formats them into a consistent
 * API response shape. Maps known error types (Zod, Mongoose, JWT)
 * into human-readable messages.
 *
 * Pattern: throw AppError → this middleware catches → clean JSON response
 */
const { z } = require("zod");

// ── Custom Application Error ──
class AppError extends Error {
  /**
   * @param {string} message  – User-facing error message
   * @param {number} statusCode – HTTP status code
   * @param {string} [code]   – Machine-readable error code
   */
  constructor(message, statusCode, code = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Distinguishes expected vs unexpected errors

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 handler — runs when no route matches.
 */
const notFoundHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404, "NOT_FOUND"));
};

/**
 * Global error handler middleware.
 * Must have exactly 4 params so Express recognises it as an error handler.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  // ── Zod Validation Errors ──
  if (err instanceof z.ZodError) {
    const fieldErrors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      code: "VALIDATION_ERROR",
      errors: fieldErrors,
    });
  }

  // ── Mongoose Validation Error ──
  if (err.name === "ValidationError" && err.errors) {
    const fieldErrors = Object.entries(err.errors).map(([field, detail]) => ({
      field,
      message: detail.message,
      code: "MONGOOSE_VALIDATION",
    }));

    return res.status(400).json({
      success: false,
      message: "Database validation failed.",
      code: "VALIDATION_ERROR",
      errors: fieldErrors,
    });
  }

  // ── Mongoose Duplicate Key ──
  if (err.code === 11000) {
    const duplicatedField = Object.keys(err.keyValue || {})[0] || "unknown";
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field "${duplicatedField}".`,
      code: "DUPLICATE_KEY",
    });
  }

  // ── Mongoose Cast Error (bad ObjectId) ──
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for "${err.path}": ${err.value}`,
      code: "INVALID_ID",
    });
  }

  // ── JWT Errors ──
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
      code: "INVALID_TOKEN",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token has expired.",
      code: "TOKEN_EXPIRED",
    });
  }

  // ── Operational AppError ──
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  // ── Unexpected / Unknown Errors ──
  console.error("[Unhandled Error]", err);
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong. Please try again later."
        : err.message,
    code: "INTERNAL_ERROR",
  });
};

/**
 * Wraps an async route handler so thrown errors are automatically
 * forwarded to the error handling middleware (no try/catch needed in every controller).
 * @param {Function} fn
 * @returns {Function}
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { AppError, errorHandler, notFoundHandler, asyncHandler };
