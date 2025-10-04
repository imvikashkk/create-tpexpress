import { createClient, RedisClientType } from 'redis';
import env from '@/config/env.js';

// Global type for development singleton
const globalForRedis = global as unknown as {
  redisClient: RedisClientType | undefined;
};

// Create Redis client if not already created
const redisClient: RedisClientType =
  globalForRedis.redisClient ??
  createClient({
    url: env.REDIS_URL,
    socket: {
      connectTimeout: 60000,
    },
  });

// Save to global in development to prevent multiple connections on hot reload
if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redisClient = redisClient;
}

/**
 * Connect Redis safely.
 * - Avoid multiple connect() calls if already connected
 * - Logs PID for debugging
 */
const connectRedis = async (): Promise<'success'> => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.info(`✅ Redis successfully connected PID:${process.pid}`);
    } else {
      console.info(`ℹ️ Redis already connected PID:${process.pid}`);
    }
    return 'success';
  } catch (error) {
    console.error(`❌ Redis connection Error PID:${process.pid}`);
    console.error(error);
    process.exit(1);
  }
};

export { connectRedis };
export default redisClient;
