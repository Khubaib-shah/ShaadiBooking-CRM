/**
 * BullMQ Queue Definitions
 * ────────────────────────
 * Centralises all background job queues.
 * Workers process jobs asynchronously (email, notifications, etc.).
 */
const { Queue, Worker } = require("bullmq");
const env = require("../config/environment");

// Redis connection for BullMQ
const redisConnection = {
  host: new URL(env.REDIS_URL).hostname || "127.0.0.1",
  port: parseInt(new URL(env.REDIS_URL).port) || 6379,
};

// ── Queue Definitions ──
const emailQueue = new Queue("email", { connection: redisConnection });
const notificationQueue = new Queue("notification", { connection: redisConnection });

// ── Email Worker ──
const emailWorker = new Worker(
  "email",
  async (job) => {
    const { to, subject, body, template } = job.data;
    console.info(`[EmailWorker] Processing job ${job.id}: ${subject} → ${to}`);

    // TODO: Integrate actual email transport (nodemailer / SendGrid / SES)
    // For now, log the email details
    console.info(`[EmailWorker] Email sent successfully (stub): ${to}`);

    return { sent: true, to, subject };
  },
  {
    connection: redisConnection,
    concurrency: 5,
    limiter: { max: 10, duration: 1000 }, // 10 emails/sec max
  }
);

emailWorker.on("completed", (job) => {
  console.info(`[EmailWorker] Job ${job.id} completed.`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`[EmailWorker] Job ${job?.id} failed:`, err.message);
});

// ── Notification Worker ──
const notificationWorker = new Worker(
  "notification",
  async (job) => {
    const { type, recipientId, title, message } = job.data;
    console.info(`[NotificationWorker] Processing: ${type} → ${recipientId}`);

    // This worker can batch or throttle notifications
    const notificationService = require("../services/notification.service");
    await notificationService.createNotification({
      recipientId,
      type,
      title,
      message,
      relatedEntity: job.data.relatedEntity,
    });

    return { processed: true };
  },
  {
    connection: redisConnection,
    concurrency: 10,
  }
);

notificationWorker.on("failed", (job, err) => {
  console.error(`[NotificationWorker] Job ${job?.id} failed:`, err.message);
});

/**
 * Enqueue an email job.
 * @param {{ to: string, subject: string, body: string, template?: string }} data
 */
const enqueueEmail = async (data) => {
  await emailQueue.add("send-email", data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  });
};

/**
 * Enqueue a notification job.
 * @param {object} data
 */
const enqueueNotification = async (data) => {
  await notificationQueue.add("push-notification", data, {
    attempts: 2,
    backoff: { type: "fixed", delay: 1000 },
  });
};

/**
 * Graceful shutdown for all workers.
 */
const closeWorkers = async () => {
  await emailWorker.close();
  await notificationWorker.close();
  await emailQueue.close();
  await notificationQueue.close();
  console.info("[BullMQ] All workers and queues closed.");
};

module.exports = { enqueueEmail, enqueueNotification, closeWorkers };
