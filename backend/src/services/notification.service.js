/**
 * Notification Service
 * ────────────────────
 * Creates in-app notifications and emits them via Socket.IO.
 * Also enqueues email notifications via BullMQ.
 */
const Notification = require("../models/Notification");
const { getIO } = require("../config/socket");

/**
 * @typedef {Object} NotificationPayload
 * @property {string} recipientId
 * @property {string} type
 * @property {string} title
 * @property {string} message
 * @property {{ kind: string, id: string }} [relatedEntity]
 * @property {Record<string, unknown>} [metadata]
 */

/**
 * Create a notification, persist it, and push it in real time.
 * @param {NotificationPayload} payload
 * @returns {Promise<import('mongoose').Document>}
 */
const createNotification = async (payload) => {
  const notification = await Notification.create(payload);

  // Push via Socket.IO to the recipient's personal room
  try {
    const io = getIO();
    io.to(`user:${payload.recipientId}`).emit("notification:new", {
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      relatedEntity: notification.relatedEntity,
      createdAt: notification.createdAt,
    });
  } catch (err) {
    // Socket.IO might not be initialized in test environments
    console.warn("[NotificationService] Socket emit failed:", err.message);
  }

  return notification;
};

/**
 * Mark a notification as read.
 * @param {string} notificationId
 * @param {string} userId – to verify ownership
 * @returns {Promise<import('mongoose').Document | null>}
 */
const markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipientId: userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

/**
 * Mark all of a user's notifications as read.
 * @param {string} userId
 */
const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { recipientId: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

/**
 * Get paginated notifications for a user.
 * @param {string} userId
 * @param {{ page: number, limit: number, unreadOnly?: boolean }} options
 */
const getUserNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false }) => {
  const query = { recipientId: userId };
  if (unreadOnly) query.isRead = false;

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Notification.countDocuments(query),
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  createNotification,
  markAsRead,
  markAllAsRead,
  getUserNotifications,
};
