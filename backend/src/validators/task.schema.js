/**
 * Task Validation Schemas
 * ───────────────────────
 * Covers task creation, update, and query filtering.
 */
const { z } = require("zod");

const TASK_TYPES = [
  "planning",
  "vendor_coordination",
  "payment",
  "logistics",
  "communication",
  "other",
];

const TASK_STATUSES = [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
  "overdue",
];

const TASK_PRIORITIES = ["low", "medium", "high", "urgent"];

const createTaskSchema = z.object({
  eventId: z.string({ required_error: "Event ID is required." }).min(1),
  title: z
    .string({ required_error: "Task title is required." })
    .min(1, "Title cannot be empty.")
    .max(200)
    .trim(),
  description: z.string().max(2000).optional(),
  type: z.enum(TASK_TYPES, {
    errorMap: () => ({
      message: `Type must be one of: ${TASK_TYPES.join(", ")}`,
    }),
  }),
  priority: z.enum(TASK_PRIORITIES).default("medium"),
  assignedTo: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  estimatedHours: z.number().min(0).optional(),
  subtasks: z
    .array(
      z.object({
        title: z.string().min(1),
        completed: z.boolean().default(false),
      })
    )
    .optional()
    .default([]),
  tags: z.array(z.string()).optional().default([]),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  assignedTo: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  estimatedHours: z.number().min(0).optional(),
  actualHours: z.number().min(0).optional(),
});

const taskQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  eventId: z.string().optional(),
});

module.exports = { createTaskSchema, updateTaskSchema, taskQuerySchema };
