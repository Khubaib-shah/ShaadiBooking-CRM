/**
 * Booking Validation Schemas
 * ──────────────────────────
 * Covers creation, status transitions, and query params for bookings.
 */
const { z } = require("zod");

const BOOKING_SERVICES = [
  "photography",
  "catering",
  "venue",
  "decoration",
  "music",
  "transportation",
  "other",
];

const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "disputed",
];

const createBookingSchema = z.object({
  eventId: z.string({ required_error: "Event ID is required." }).min(1),
  vendorId: z.string({ required_error: "Vendor ID is required." }).min(1),
  service: z.enum(BOOKING_SERVICES, {
    errorMap: () => ({
      message: `Service must be one of: ${BOOKING_SERVICES.join(", ")}`,
    }),
  }),
  bookingDate: z
    .string({ required_error: "Booking date is required." })
    .datetime({ message: "Booking date must be a valid ISO date string." }),
  duration: z
    .number({ required_error: "Duration is required." })
    .int()
    .min(1, "Duration must be at least 1 hour."),
  pricing: z.object({
    baseRate: z.number().min(0, "Base rate cannot be negative."),
    additionalFees: z
      .array(
        z.object({
          description: z.string().min(1),
          amount: z.number().min(0),
        })
      )
      .optional()
      .default([]),
    currency: z.string().default("USD"),
    deposit: z
      .object({
        required: z.boolean().default(false),
        amount: z.number().min(0).optional(),
      })
      .optional(),
  }),
  requirements: z
    .object({
      description: z.string().optional(),
      specialRequests: z.string().optional(),
      equipment: z.array(z.string()).optional(),
      staffCount: z.number().int().min(0).optional(),
    })
    .optional(),
});

const updateBookingStatusSchema = z.object({
  status: z.enum(BOOKING_STATUSES, {
    errorMap: () => ({
      message: `Status must be one of: ${BOOKING_STATUSES.join(", ")}`,
    }),
  }),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters.").optional(),
});

const bookingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(BOOKING_STATUSES).optional(),
  service: z.enum(BOOKING_SERVICES).optional(),
});

module.exports = {
  createBookingSchema,
  updateBookingStatusSchema,
  bookingQuerySchema,
};
