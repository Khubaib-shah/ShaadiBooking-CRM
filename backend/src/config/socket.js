/**
 * Socket.IO Configuration
 * ───────────────────────
 * Initializes Socket.IO with JWT-based authentication for WebSocket connections.
 * Only authenticated users can subscribe to real-time channels.
 */
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const env = require("./environment");

/** @type {Server | null} */
let io = null;

/**
 * Creates and configures the Socket.IO server on top of an HTTP server.
 * @param {import('http').Server} httpServer
 * @returns {Server}
 */
const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ── JWT Authentication Middleware ──
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.authorization;

    if (!token) {
      return next(new Error("Authentication required for WebSocket connection."));
    }

    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    try {
      const decoded = jwt.verify(cleanToken, env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      socket.tenantId = decoded.tenantId;
      next();
    } catch (err) {
      return next(new Error("Invalid or expired token."));
    }
  });

  // ── Connection Handler ──
  io.on("connection", (socket) => {
    console.info(
      `[Socket.IO] User ${socket.userId} connected (${socket.userRole})`
    );

    // Auto-join the user's personal room for targeted notifications
    socket.join(`user:${socket.userId}`);

    // Auto-join the tenant room for org-wide broadcasts
    if (socket.tenantId) {
      socket.join(`tenant:${socket.tenantId}`);
    }

    // Join a specific event room (for real-time booking / task updates)
    socket.on("join:event", (eventId) => {
      if (typeof eventId === "string" && eventId.length > 0) {
        socket.join(`event:${eventId}`);
      }
    });

    socket.on("leave:event", (eventId) => {
      if (typeof eventId === "string" && eventId.length > 0) {
        socket.leave(`event:${eventId}`);
      }
    });

    socket.on("disconnect", (reason) => {
      console.info(
        `[Socket.IO] User ${socket.userId} disconnected (${reason})`
      );
    });
  });

  return io;
};

/**
 * Returns the current Socket.IO instance.
 * @returns {Server}
 */
const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized. Call initializeSocket first.");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
