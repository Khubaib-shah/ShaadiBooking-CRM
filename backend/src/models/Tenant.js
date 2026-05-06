/**
 * Tenant (Organization) Model
 * ────────────────────────────
 * Represents a tenant / organization in the multi-tenant system.
 * Each non-admin user belongs to exactly one tenant.
 * All data queries for non-admin users are scoped by tenant.
 */
const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    domain: {
      type: String,
      unique: true,
      sparse: true, // Allows null — not every tenant has a custom domain
      lowercase: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    settings: {
      currency: { type: String, default: "USD" },
      timezone: { type: String, default: "UTC" },
      locale: { type: String, default: "en-US" },
      branding: {
        logo: String,
        primaryColor: { type: String, default: "#E91E63" },
        accentColor: { type: String, default: "#FF9800" },
      },
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "starter", "professional", "enterprise"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "trialing", "past_due", "cancelled"],
        default: "active",
      },
      expiresAt: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
tenantSchema.index({ slug: 1 }, { unique: true });
tenantSchema.index({ owner: 1 });
tenantSchema.index({ isActive: 1 });
tenantSchema.index({ "subscription.plan": 1 });

module.exports = mongoose.model("Tenant", tenantSchema);
