/**
 * Cache Service
 * ─────────────
 * Abstraction over Redis for caching. If Redis is unavailable,
 * all operations gracefully no-op instead of crashing.
 *
 * Pattern: Cache-aside (read-through with manual invalidation).
 */
const { getRedisClient } = require("../config/redis");

const DEFAULT_TTL = 300; // 5 minutes

/**
 * Get a cached value by key.
 * @param {string} key
 * @returns {Promise<object | null>}
 */
const get = async (key) => {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const cached = await client.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.warn(`[Cache] GET failed for key "${key}":`, err.message);
    return null;
  }
};

/**
 * Set a value in cache with an optional TTL.
 * @param {string} key
 * @param {object} value
 * @param {number} [ttl] – Time to live in seconds (default: 300)
 */
const set = async (key, value, ttl = DEFAULT_TTL) => {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    console.warn(`[Cache] SET failed for key "${key}":`, err.message);
  }
};

/**
 * Invalidate (delete) a specific cache key.
 * @param {string} key
 */
const invalidate = async (key) => {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.del(key);
  } catch (err) {
    console.warn(`[Cache] DEL failed for key "${key}":`, err.message);
  }
};

/**
 * Invalidate all keys matching a pattern (e.g., "vendors:*").
 * Uses SCAN to avoid blocking the server.
 * @param {string} pattern
 */
const invalidatePattern = async (pattern) => {
  const client = getRedisClient();
  if (!client) return;

  try {
    let cursor = 0;
    do {
      const result = await client.scan(cursor, { MATCH: pattern, COUNT: 100 });
      cursor = result.cursor;

      if (result.keys.length > 0) {
        await client.del(result.keys);
      }
    } while (cursor !== 0);
  } catch (err) {
    console.warn(`[Cache] Pattern invalidation failed for "${pattern}":`, err.message);
  }
};

/**
 * Cache-aside helper: try cache first, fall back to the fetcher function.
 * @param {string} key
 * @param {() => Promise<object>} fetcher  – The DB query to run on cache miss
 * @param {number} [ttl]
 * @returns {Promise<object>}
 */
const getOrSet = async (key, fetcher, ttl = DEFAULT_TTL) => {
  const cached = await get(key);
  if (cached) return cached;

  const fresh = await fetcher();
  await set(key, fresh, ttl);
  return fresh;
};

module.exports = { get, set, invalidate, invalidatePattern, getOrSet };
