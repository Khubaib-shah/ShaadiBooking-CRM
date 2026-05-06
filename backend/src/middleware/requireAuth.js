/**
 * Authentication Middleware
 * ────────────────────────
 * Verifies JWT, loads the user from DB, and attaches a session object
 * to `req.session` containing userId, role, and tenantId.
 *
 * Separate from authorization (requireRole.js) for single-responsibility.
 */
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AppError } = require("./errorHandler");
const env = require("../config/environment");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
const requireAuth = async (req, _res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access denied. No token provided.", 401, "NO_TOKEN");
    }

    const token = authHeader.slice(7); // Remove "Bearer "

    // 2. Verify the token
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // 3. Load the user (check they still exist and are active)
    const user = await User.findById(decoded.userId).select("-password").lean();

    if (!user) {
      throw new AppError("User associated with this token no longer exists.", 401, "USER_NOT_FOUND");
    }

    if (!user.isActive) {
      throw new AppError("Account is deactivated. Contact support.", 401, "ACCOUNT_DEACTIVATED");
    }

    // 4. Attach session to request
    req.user = user;
    req.session = {
      userId: user._id.toString(),
      role: user.role,
      tenantId: user.organizationId ? user.organizationId.toString() : null,
    };

    next();
  } catch (err) {
    // Let JWT-specific errors propagate to the error handler
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(err);
    }
    next(err);
  }
};

module.exports = requireAuth;
