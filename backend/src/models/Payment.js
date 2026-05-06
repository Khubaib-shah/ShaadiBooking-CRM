const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    payerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    type: {
      type: String,
      enum: ["deposit", "final", "milestone", "refund", "fee"],
      required: true,
    },
    method: {
      type: String,
      enum: ["stripe", "paypal", "bank_transfer", "cash", "check"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    gatewayResponse: mongoose.Schema.Types.Mixed, // Store full response from payment gateway
    description: String,
    dueDate: Date,
    paidDate: Date,
    refundedAmount: {
      type: Number,
      default: 0,
    },
    refundReason: String,
    fees: {
      platformFee: Number,
      processingFee: Number,
      currency: { type: String, default: "USD" },
    },
    metadata: mongoose.Schema.Types.Mixed, // Additional data
    webhooks: [
      {
        event: String,
        data: mongoose.Schema.Types.Mixed,
        receivedAt: { type: Date, default: Date.now },
      },
    ],
    attempts: [
      {
        attemptDate: { type: Date, default: Date.now },
        status: String,
        error: String,
        gatewayResponse: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Indexes
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ payerId: 1 });
paymentSchema.index({ payeeId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ dueDate: 1 });
paymentSchema.index({ paidDate: 1 });

// Virtual for isOverdue
paymentSchema.virtual("isOverdue").get(function () {
  return this.status === "pending" && this.dueDate && new Date() > this.dueDate;
});

// Virtual for netAmount (after fees)
paymentSchema.virtual("netAmount").get(function () {
  const totalFees =
    (this.fees.platformFee || 0) + (this.fees.processingFee || 0);
  return Math.max(0, this.amount - totalFees);
});

// Pre-save middleware to validate amounts
paymentSchema.pre("save", function (next) {
  if (this.refundedAmount > this.amount) {
    return next(new Error("Refunded amount cannot exceed payment amount"));
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
