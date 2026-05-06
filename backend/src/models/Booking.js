const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: String,
      required: true,
      enum: [
        "photography",
        "catering",
        "venue",
        "decoration",
        "music",
        "transportation",
        "other",
      ],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "disputed",
      ],
      default: "pending",
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in hours
      required: true,
      min: 1,
    },
    pricing: {
      baseRate: {
        type: Number,
        required: true,
      },
      additionalFees: [
        {
          description: String,
          amount: Number,
        },
      ],
      totalAmount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "USD",
      },
      deposit: {
        required: { type: Boolean, default: false },
        amount: Number,
        paid: { type: Boolean, default: false },
        paidDate: Date,
      },
    },
    requirements: {
      description: String,
      specialRequests: String,
      equipment: [String],
      staffCount: Number,
      setupTime: Number, // in hours
    },
    contract: {
      terms: String,
      signed: { type: Boolean, default: false },
      signedDate: Date,
      signedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    payment: {
      status: {
        type: String,
        enum: ["pending", "partial", "paid", "refunded", "failed"],
        default: "pending",
      },
      transactions: [
        {
          amount: Number,
          method: {
            type: String,
            enum: ["stripe", "paypal", "bank_transfer", "cash"],
          },
          transactionId: String,
          status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
          },
          date: { type: Date, default: Date.now },
        },
      ],
      dueDate: Date,
      lateFees: Number,
    },
    timeline: [
      {
        stage: String,
        description: String,
        dueDate: Date,
        completed: { type: Boolean, default: false },
        completedDate: Date,
      },
    ],
    notes: [
      {
        content: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: { type: Date, default: Date.now },
        isPrivate: { type: Boolean, default: false },
      },
    ],
    ratings: {
      customerRating: {
        score: { type: Number, min: 1, max: 5 },
        review: String,
        date: Date,
      },
      vendorRating: {
        score: { type: Number, min: 1, max: 5 },
        review: String,
        date: Date,
      },
    },
    conflicts: [
      {
        type: {
          type: String,
          enum: ["double_booking", "availability", "payment", "contract"],
        },
        description: String,
        resolved: { type: Boolean, default: false },
        resolvedDate: Date,
        resolvedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    cancellation: {
      cancelled: { type: Boolean, default: false },
      cancelledDate: Date,
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reason: String,
      refundAmount: Number,
      refundStatus: {
        type: String,
        enum: ["pending", "processed", "denied"],
      },
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
bookingSchema.index({ eventId: 1 });
bookingSchema.index({ vendorId: 1 });
bookingSchema.index({ customerId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ "pricing.totalAmount": 1 });

// Compound indexes for conflict detection
bookingSchema.index({ vendorId: 1, bookingDate: 1 });
bookingSchema.index({ vendorId: 1, status: 1 });

// Virtual for isOverdue
bookingSchema.virtual("isOverdue").get(function () {
  return (
    this.status !== "completed" &&
    this.status !== "cancelled" &&
    new Date() > this.bookingDate
  );
});

// Pre-save middleware for total calculation
bookingSchema.pre("save", function (next) {
  if (this.pricing.baseRate && this.pricing.additionalFees) {
    this.pricing.totalAmount =
      this.pricing.baseRate +
      this.pricing.additionalFees.reduce(
        (sum, fee) => sum + (fee.amount || 0),
        0,
      );
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
