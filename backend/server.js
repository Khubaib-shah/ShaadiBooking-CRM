/**
 * ShaadiBook Server Entry Point
 * ─────────────────────────────
 * Boots the application:
 *  1. Validates environment
 *  2. Connects to MongoDB + Redis
 *  3. Initializes Socket.IO
 *  4. Starts BullMQ workers
 *  5. Starts HTTP server
 *  6. Handles graceful shutdown
 *
 * This file does NOT define routes or middleware — that's app.js's job.
 */
require("dotenv").config();

const { createServer } = require("http");
const env = require("./src/config/environment");
const { connectDatabase, disconnectDatabase } = require("./src/config/database");
const { connectRedis, disconnectRedis } = require("./src/config/redis");
const { initializeSocket } = require("./src/config/socket");
const app = require("./src/app");

const httpServer = createServer(app);

/**
 * Boot sequence — run all initializers then listen.
 */
const bootstrap = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDatabase();

    // 2. Connect to Redis (non-blocking — app works without it)
    await connectRedis();

    // 3. Initialize Socket.IO with JWT auth
    const io = initializeSocket(httpServer);
    app.set("io", io);

    // 4. Initialize BullMQ workers (lazy — only if Redis is available)
    try {
      require("./src/jobs/queues");
      console.info("[BullMQ] Workers initialized.");
    } catch (err) {
      console.warn("[BullMQ] Workers not started:", err.message);
    }

    // 5. Start listening
    httpServer.listen(env.PORT, "127.0.0.1", () => {
      console.info("╔══════════════════════════════════════╗");
      console.info("║      ShaadiBook API Server           ║");
      console.info("╠══════════════════════════════════════╣");
      console.info(`║  URL:  http://127.0.0.1:${env.PORT}       ║`);
      console.info(`║  ENV:  ${env.NODE_ENV.padEnd(25)}  ║`);
      console.info("╚══════════════════════════════════════╝");
    });
  } catch (err) {
    console.error("[Fatal] Server failed to start:", err);
    process.exit(1);
  }
};

/**
 * Graceful shutdown — close connections cleanly on SIGINT/SIGTERM.
 */
const shutdown = async (signal) => {
  console.info(`\n[Shutdown] ${signal} received. Closing connections…`);

  httpServer.close(async () => {
    try {
      await disconnectDatabase();
      await disconnectRedis();

      const { closeWorkers } = require("./src/jobs/queues");
      await closeWorkers();
    } catch (err) {
      console.error("[Shutdown] Error during cleanup:", err.message);
    }

    console.info("[Shutdown] Server stopped.");
    process.exit(0);
  });

  // Force shutdown after 10s if graceful shutdown hangs
  setTimeout(() => {
    console.error("[Shutdown] Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => {
  console.error("[Unhandled Rejection]", reason);
});

bootstrap();

module.exports = { app, httpServer };
