/**
 * Event Validation Schemas
 * ────────────────────────
 * Covers event creation, update, and query filtering.
 */
const { z } = require("zod");

const EVENT_TYPES = [
  "wedding",
  "engagement",
  "reception",
  "corporate",
  "birthday",
  "other",
];

const EVENT_STATUSES = [
  "planning",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
];

const createEventSchema = z.object({
  title: z
    .string({ required_error: "Event title is required." })
    .min(1, "Title cannot be empty.")
    .max(200, "Title is too long.")
    .trim(),
  description: z.string().max(2000, "Description is too long.").optional(),
  type: z.enum(EVENT_TYPES, {
    errorMap: () => ({
      message: `Type must be one of: ${EVENT_TYPES.join(", ")}`,
    }),
  }),
  date: z
    .string({ required_error: "Event date is required." })
    .datetime("Date must be a valid ISO date string."),
  endDate: z.string().datetime("End date must be a valid ISO date string.").optional(),
  venue: z
    .object({
      name: z.string().min(1).optional(),
      address: z
        .object({
          street: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zipCode: z.string().optional(),
          country: z.string().optional(),
        })
        .optional(),
      capacity: z.number().int().min(1).optional(),
      contactInfo: z
        .object({
          phone: z.string().optional(),
          email: z.string().email().optional(),
        })
        .optional(),
    })
    .optional(),
  guestCount: z.number().int().min(1, "Guest count must be at least 1.").optional(),
  budget: z
    .object({
      total: z.number().min(0).optional(),
      currency: z.string().default("USD"),
    })
    .optional(),
  weddingPlannerId: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
});

const updateEventSchema = createEventSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "At least one field must be provided for update."
);

const eventQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(EVENT_STATUSES).optional(),
  type: z.enum(EVENT_TYPES).optional(),
  search: z.string().optional(),
});

module.exports = { createEventSchema, updateEventSchema, eventQuerySchema };
