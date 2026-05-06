/**
 * Vendor Service
 * ──────────────
 * Business logic for vendor search and availability.
 */
const User = require("../models/User");
const cacheService = require("./cache.service");

const getVendors = async (queryParams) => {
  const { page = 1, limit = 10, service, search, location } = queryParams;
  const query = { role: "vendor", isActive: true };

  if (service) query["vendorDetails.services"] = service;
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

  const cacheKey = `vendors:${JSON.stringify(queryParams)}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) return cached;

  const [vendors, total] = await Promise.all([
    User.find(query)
      .select("firstName lastName email profile vendorDetails")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ "vendorDetails.pricing.baseRate": 1 })
      .lean(),
    User.countDocuments(query),
  ]);

  const result = {
    vendors,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };

  await cacheService.set(cacheKey, result, 300); // 5 min cache
  return result;
};

const getVendorById = async (vendorId) => {
  const cacheKey = `vendor:${vendorId}`;
  return cacheService.getOrSet(
    cacheKey,
    async () => {
      const vendor = await User.findOne({ _id: vendorId, role: "vendor" })
        .select("firstName lastName email profile vendorDetails")
        .lean();

      if (!vendor) {
        const { AppError } = require("../middleware/errorHandler");
        throw new AppError("Vendor not found.", 404, "VENDOR_NOT_FOUND");
      }
      return vendor;
    },
    300
  );
};

module.exports = { getVendors, getVendorById };
