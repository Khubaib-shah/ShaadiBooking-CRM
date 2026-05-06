/**
 * Notification Model
 * ──────────────────
 * In-app notifications for real-time updates.
 * Linked to Socket.IO emissions for live delivery.
 */
const mongoose = require("mongoose");

const NOTIFICATION_TYPES = [
  "booking_created",
  "booking_updated",
  "booking_cancelled",
  "payment_received",
  "payment_failed",
  "task_assigned",
  "task_completed",
  "task_overdue",
  "event_reminder",
  "vendor_message",
  "system",
];

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    // Polymorphic reference — the entity this notification relates to
    relatedEntity: {
      kind: {
        type: String,
        enum: ["Event", "Booking", "Payment", "Task"],
      },
      id: mongoose.Schema.Types.ObjectId,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

// Indexes — notifications are queried per-user, sorted by recency
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isRead: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
