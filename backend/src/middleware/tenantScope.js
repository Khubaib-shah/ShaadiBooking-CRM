/**
 * Multi-Tenancy Scoping Middleware
 * ─────────────────────────────────
 * Automatically injects `tenantId` filters into queries to prevent
 * data leakage between organizations. Must be used AFTER requireAuth.
 *
 * Admins can optionally bypass tenant scoping for platform-wide views.
 *
 * This middleware attaches a `tenantFilter` object to `req` that
 * controllers/services should spread into their Mongoose queries:
 *
 *   const events = await Event.find({ ...req.tenantFilter, status: "planning" });
 */
const { AppError } = require("./errorHandler");

/**
 * @param {{ allowAdmin?: boolean }} options
 *   - allowAdmin: if true, admin role skips tenant scoping (sees all data)
 * @returns {import('express').RequestHandler}
 */
const tenantScope = (options = { allowAdmin: true }) => {
  return (req, _res, next) => {
    if (!req.session) {
      return next(
        new AppError(
          "Authentication required for tenant scoping.",
          401,
          "AUTH_REQUIRED"
        )
      );
    }

    // Platform admins can see everything (if allowed)
    if (options.allowAdmin && req.session.role === "admin") {
      req.tenantFilter = {};
      return next();
    }

    // Non-admin users MUST have a tenantId
    if (!req.session.tenantId) {
      return next(
        new AppError(
          "No organization associated with your account.",
          403,
          "NO_TENANT"
        )
      );
    }

    // This filter should be spread into every DB query
    req.tenantFilter = { organizationId: req.session.tenantId };
    next();
  };
};

module.exports = tenantScope;
