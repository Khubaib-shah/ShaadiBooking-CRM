/**
 * Payment Validation Schemas
 * ──────────────────────────
 * Covers payment creation, status updates, and refund requests.
 */
const { z } = require("zod");

const PAYMENT_TYPES = ["deposit", "final", "milestone", "refund", "fee"];
const PAYMENT_METHODS = ["stripe", "paypal", "bank_transfer", "cash", "check"];
const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
  "refunded",
];

const createPaymentSchema = z.object({
  bookingId: z.string({ required_error: "Booking ID is required." }).min(1),
  payeeId: z.string({ required_error: "Payee ID is required." }).min(1),
  amount: z
    .number({ required_error: "Amount is required." })
    .positive("Amount must be greater than zero."),
  currency: z.string().default("USD"),
  type: z.enum(PAYMENT_TYPES, {
    errorMap: () => ({
      message: `Payment type must be one of: ${PAYMENT_TYPES.join(", ")}`,
    }),
  }),
  method: z.enum(PAYMENT_METHODS, {
    errorMap: () => ({
      message: `Payment method must be one of: ${PAYMENT_METHODS.join(", ")}`,
    }),
  }),
  description: z.string().max(500).optional(),
  dueDate: z.string().datetime().optional(),
});

const updatePaymentStatusSchema = z.object({
  status: z.enum(PAYMENT_STATUSES, {
    errorMap: () => ({
      message: `Status must be one of: ${PAYMENT_STATUSES.join(", ")}`,
    }),
  }),
  transactionId: z.string().optional(),
});

const refundSchema = z.object({
  amount: z.number().positive("Refund amount must be greater than zero."),
  reason: z
    .string({ required_error: "Refund reason is required." })
    .min(10, "Reason must be at least 10 characters.")
    .max(500),
});

const paymentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: z.enum(PAYMENT_STATUSES).optional(),
  type: z.enum(PAYMENT_TYPES).optional(),
});

module.exports = {
  createPaymentSchema,
  updatePaymentStatusSchema,
  refundSchema,
  paymentQuerySchema,
};
