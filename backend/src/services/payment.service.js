/**
 * Payment Service
 * ───────────────
 * Business logic for payment lifecycle including
 * retry logic and failure handling.
 */
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const { AppError } = require("../middleware/errorHandler");
const { createNotification } = require("./notification.service");
const { enqueueEmail } = require("../jobs/queues");
const cacheService = require("./cache.service");

const MAX_RETRY_ATTEMPTS = 3;

/**
 * Create a payment record.
 * @param {object} data – Validated payment data
 * @param {object} requestingUser
 */
const createPayment = async (data, requestingUser) => {
  const booking = await Booking.findById(data.bookingId);
  if (!booking) {
    throw new AppError("Booking not found.", 404, "BOOKING_NOT_FOUND");
  }

  // Ensure the payer has access
  if (
    requestingUser.role !== "admin" &&
    booking.customerId.toString() !== requestingUser._id.toString()
  ) {
    throw new AppError("Access denied.", 403, "ACCESS_DENIED");
  }

  const payment = new Payment({
    ...data,
    payerId: requestingUser._id,
  });

  await payment.save();

  // Notify the payee
  await createNotification({
    recipientId: data.payeeId,
    type: "payment_received",
    title: "Payment Initiated",
    message: `A ${data.type} payment of ${data.amount} ${data.currency} has been initiated.`,
    relatedEntity: { kind: "Payment", id: payment._id },
  });

  await cacheService.invalidatePattern("payments:*");

  return payment;
};

/**
 * Process a payment (simulate gateway interaction).
 * Implements retry logic with attempt tracking.
 * @param {string} paymentId
 */
const processPayment = async (paymentId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new AppError("Payment not found.", 404, "PAYMENT_NOT_FOUND");
  }

  if (payment.status !== "pending" && payment.status !== "failed") {
    throw new AppError(
      `Cannot process payment in "${payment.status}" status.`,
      400,
      "INVALID_PAYMENT_STATUS"
    );
  }

  // Check retry limit
  if (payment.attempts.length >= MAX_RETRY_ATTEMPTS) {
    payment.status = "cancelled";
    await payment.save();

    await createNotification({
      recipientId: payment.payerId.toString(),
      type: "payment_failed",
      title: "Payment Failed",
      message: `Payment of ${payment.amount} ${payment.currency} has been cancelled after ${MAX_RETRY_ATTEMPTS} failed attempts.`,
      relatedEntity: { kind: "Payment", id: payment._id },
    });

    throw new AppError(
      "Maximum payment retry attempts exceeded.",
      400,
      "MAX_RETRIES_EXCEEDED"
    );
  }

  // Record the attempt
  payment.status = "processing";
  payment.attempts.push({
    attemptDate: new Date(),
    status: "processing",
  });
  await payment.save();

  // TODO: Real Stripe/PayPal integration goes here
  // For now, simulate success
  payment.status = "completed";
  payment.paidDate = new Date();
  payment.attempts[payment.attempts.length - 1].status = "completed";
  await payment.save();

  // Update the booking payment status
  await Booking.findByIdAndUpdate(payment.bookingId, {
    "payment.status": "paid",
  });

  // Send confirmation email via background job
  await enqueueEmail({
    to: "customer@example.com", // Would resolve from payerId
    subject: "Payment Confirmation — ShaadiBook",
    body: `Your payment of ${payment.amount} ${payment.currency} has been processed successfully.`,
  });

  await cacheService.invalidatePattern("payments:*");

  return payment;
};

/**
 * Get paginated payments with role-based filtering.
 */
const getPayments = async (requestingUser, queryParams) => {
  const { page, limit, status, type } = queryParams;
  const query = {};

  if (requestingUser.role === "customer") {
    query.payerId = requestingUser._id;
  } else if (requestingUser.role === "vendor") {
    query.payeeId = requestingUser._id;
  }

  if (status) query.status = status;
  if (type) query.type = type;

  const cacheKey = `payments:${requestingUser._id}:${JSON.stringify(queryParams)}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) return cached;

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate("bookingId", "service")
      .populate("payerId", "firstName lastName")
      .populate("payeeId", "firstName lastName")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .lean(),
    Payment.countDocuments(query),
  ]);

  const result = {
    payments,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };

  await cacheService.set(cacheKey, result, 120);
  return result;
};

module.exports = { createPayment, processPayment, getPayments };
