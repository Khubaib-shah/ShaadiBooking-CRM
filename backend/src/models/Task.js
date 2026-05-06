const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "planning",
        "vendor_coordination",
        "payment",
        "logistics",
        "communication",
        "other",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled", "overdue"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: Date,
    completedDate: Date,
    estimatedHours: Number,
    actualHours: Number,
    dependencies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    subtasks: [
      {
        title: String,
        completed: { type: Boolean, default: false },
        completedDate: Date,
      },
    ],
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        content: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: { type: Date, default: Date.now },
        mentions: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
    reminders: [
      {
        type: {
          type: String,
          enum: ["email", "push", "sms"],
        },
        scheduledFor: Date,
        sent: { type: Boolean, default: false },
        sentAt: Date,
      },
    ],
    recurring: {
      isRecurring: { type: Boolean, default: false },
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
      },
      interval: { type: Number, default: 1 }, // every N days/weeks/etc
      endDate: Date,
      parentTaskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    },
    tags: [String],
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  },
);

// Indexes
taskSchema.index({ eventId: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ type: 1 });
taskSchema.index({ tags: 1 });
taskSchema.index({ "recurring.parentTaskId": 1 });

// Virtual for isOverdue
taskSchema.virtual("isOverdue").get(function () {
  return (
    this.status !== "completed" &&
    this.status !== "cancelled" &&
    this.dueDate &&
    new Date() > this.dueDate
  );
});

// Virtual for progress (based on subtasks)
taskSchema.virtual("progress").get(function () {
  if (!this.subtasks || this.subtasks.length === 0) return 0;
  const completed = this.subtasks.filter((sub) => sub.completed).length;
  return Math.round((completed / this.subtasks.length) * 100);
});

// Pre-save middleware to update status based on due date
taskSchema.pre("save", function (next) {
  if (this.dueDate && new Date() > this.dueDate && this.status === "pending") {
    this.status = "overdue";
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);
