/**
 * MongoDB Connection
 * ──────────────────
 * Singleton connection with retry logic and event listeners.
 * Uses the validated env config to avoid typos/missing URIs.
 */
const mongoose = require("mongoose");
const env = require("./environment");

/** @type {mongoose.Connection | null} */
let connection = null;

const RETRY_DELAY_MS = 5000;
const MAX_RETRIES = 5;

/**
 * Establishes a MongoDB connection with exponential back-off retry.
 * @returns {Promise<mongoose.Connection>}
 */
const connectDatabase = async () => {
  if (connection && connection.readyState === 1) {
    return connection;
  }

  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(env.MONGODB_URI, {
        // Connection pool tuning for production workloads
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      connection = mongoose.connection;

      connection.on("error", (err) => {
        console.error("[MongoDB] Connection error:", err.message);
      });

      connection.on("disconnected", () => {
        console.warn("[MongoDB] Disconnected. Attempting reconnection…");
      });

      connection.on("reconnected", () => {
        console.info("[MongoDB] Reconnected successfully.");
      });

      console.info(`[MongoDB] Connected → ${env.MONGODB_URI.split("@").pop()}`);
      return connection;
    } catch (err) {
      retries += 1;
      const delay = RETRY_DELAY_MS * retries;
      console.error(
        `[MongoDB] Connection attempt ${retries}/${MAX_RETRIES} failed: ${err.message}`
      );

      if (retries >= MAX_RETRIES) {
        console.error("[MongoDB] Max retries reached. Exiting.");
        process.exit(1);
      }

      console.info(`[MongoDB] Retrying in ${delay / 1000}s…`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Gracefully closes the MongoDB connection (for clean shutdowns).
 */
const disconnectDatabase = async () => {
  if (connection) {
    await mongoose.disconnect();
    connection = null;
    console.info("[MongoDB] Disconnected gracefully.");
  }
};

module.exports = { connectDatabase, disconnectDatabase };
