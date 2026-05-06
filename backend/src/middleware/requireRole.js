/**
 * Role-Based Authorization Middleware
 * ─────────────────────────────────────
 * Must be used AFTER requireAuth. Checks if the authenticated user's
 * role is in the list of allowed roles for a specific route.
 *
 * Usage:
 *   router.get("/admin-only", requireAuth, requireRole("admin"), controller.adminDashboard);
 *   router.post("/", requireAuth, requireRole("customer", "wedding_planner"), controller.create);
 *
 * @param {...string} allowedRoles – One or more role strings
 * @returns {import('express').RequestHandler}
 */
const { AppError } = require("./errorHandler");

const requireRole = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.session) {
      return next(
        new AppError(
          "Authentication required before role check.",
          401,
          "AUTH_REQUIRED"
        )
      );
    }

    if (!allowedRoles.includes(req.session.role)) {
      return next(
        new AppError(
          `Access denied. Required role(s): ${allowedRoles.join(", ")}. Your role: ${req.session.role}.`,
          403,
          "INSUFFICIENT_PERMISSIONS"
        )
      );
    }

    next();
  };
};

module.exports = requireRole;
