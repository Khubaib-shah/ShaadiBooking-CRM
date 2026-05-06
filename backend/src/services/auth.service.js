/**
 * Auth Service
 * ────────────
 * Business logic for authentication: registration, login, token generation.
 * Separated from the controller for testability and reuse.
 */
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Tenant = require("../models/Tenant");
const { AppError } = require("../middleware/errorHandler");
const env = require("../config/environment");

/**
 * Generate a JWT for a given user.
 * @param {object} user – Mongoose user document (or lean object)
 * @returns {string}
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
      tenantId: user.organizationId ? user.organizationId.toString() : null,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

/**
 * Sanitize user document for API response (strip sensitive fields).
 * @param {object} user
 * @returns {object}
 */
const sanitizeUser = (user) => ({
  id: user._id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  organizationId: user.organizationId,
  profile: user.profile,
  isActive: user.isActive,
  emailVerified: user.emailVerified,
  createdAt: user.createdAt,
});

/**
 * Register a new user.
 * @param {object} data – Validated registration data
 * @returns {{ user: object, token: string }}
 */
const registerUser = async (data) => {
  // Check for existing user
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError("A user with this email already exists.", 409, "EMAIL_EXISTS");
  }

  // If an organizationId is provided, verify the tenant exists
  if (data.organizationId) {
    const tenant = await Tenant.findById(data.organizationId);
    if (!tenant || !tenant.isActive) {
      throw new AppError("Organization not found or inactive.", 404, "TENANT_NOT_FOUND");
    }
  }

  const user = new User(data);
  await user.save();

  const token = generateToken(user);

  return { user: sanitizeUser(user), token };
};

/**
 * Authenticate a user with email/password.
 * @param {{ email: string, password: string }} credentials
 * @returns {{ user: object, token: string }}
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  }

  if (!user.isActive) {
    throw new AppError("Account is deactivated. Contact support.", 401, "ACCOUNT_DEACTIVATED");
  }

  // Update last login timestamp
  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user);

  return { user: sanitizeUser(user), token };
};

/**
 * Get user profile by ID.
 * @param {string} userId
 * @returns {object}
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) {
    throw new AppError("User not found.", 404, "USER_NOT_FOUND");
  }
  return user;
};

module.exports = { registerUser, loginUser, getUserProfile, generateToken, sanitizeUser };
