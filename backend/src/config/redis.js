/**
 * Redis Client
 * ────────────
 * Singleton Redis client with graceful fallback.
 * If Redis is unavailable, the app still boots — caching just becomes a no-op.
 */
const { createClient } = require("redis");
const env = require("./environment");

/** @type {import('redis').RedisClientType | null} */
let redisClient = null;

/**
 * Initializes and connects the Redis client.
 * Returns null if Redis is unreachable (non-blocking).
 * @returns {Promise<import('redis').RedisClientType | null>}
 */
const connectRedis = async () => {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  try {
    redisClient = createClient({
      url: env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.warn("[Redis] Max reconnect attempts reached. Giving up.");
            return new Error("Redis max reconnect attempts reached");
          }
          // Exponential back-off: 200ms, 400ms, 800ms … capped at 5s
          return Math.min(retries * 200, 5000);
        },
      },
    });

    redisClient.on("error", (err) => {
      console.error("[Redis] Client error:", err.message);
    });

    redisClient.on("connect", () => {
      console.info("[Redis] Connected.");
    });

    redisClient.on("reconnecting", () => {
      console.info("[Redis] Reconnecting…");
    });

    await redisClient.connect();
    return redisClient;
  } catch (err) {
    console.warn(`[Redis] Not available (${err.message}). Running without cache.`);
    redisClient = null;
    return null;
  }
};

/**
 * Returns the current Redis client (or null if not connected).
 * @returns {import('redis').RedisClientType | null}
 */
const getRedisClient = () => redisClient;

/**
 * Gracefully disconnects from Redis.
 */
const disconnectRedis = async () => {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
    redisClient = null;
    console.info("[Redis] Disconnected gracefully.");
  }
};

module.exports = { connectRedis, getRedisClient, disconnectRedis };
