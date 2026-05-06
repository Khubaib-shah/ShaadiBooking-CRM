const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token. User not found." });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};

const checkOwnership = (modelName) => {
  return async (req, res, next) => {
    try {
      const Model = require(`../models/${modelName}`);
      const resource = await Model.findById(req.params.id);

      if (!resource) {
        return res.status(404).json({ message: "Resource not found." });
      }

      // Admin can access everything
      if (req.user.role === "admin") {
        req.resource = resource;
        return next();
      }

      // Check ownership based on role
      let ownerId;
      switch (req.user.role) {
        case "customer":
          ownerId = resource.customerId;
          break;
        case "wedding_planner":
          ownerId = resource.weddingPlannerId || resource.customerId; // Can access their assigned events
          break;
        case "vendor":
          ownerId = resource.vendorId;
          break;
        default:
          return res.status(403).json({ message: "Access denied." });
      }

      if (ownerId?.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({
            message: "Access denied. Not authorized for this resource.",
          });
      }

      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error." });
    }
  };
};

module.exports = {
  authenticate,
  authorize,
  checkOwnership,
};
