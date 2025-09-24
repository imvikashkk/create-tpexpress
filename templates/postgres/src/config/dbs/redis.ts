import { createClient, RedisClientType } from "redis";
import env from "@/config/env.js";

// Define a type for the global object to hold the single client instance
const globalForRedis = global as unknown as {
  redisClient: RedisClientType | undefined;
};

// Check if a client instance already exists, otherwise create a new one
const redisClient =
  globalForRedis.redisClient ??
  createClient({
    url: env.REDIS_URL,
    socket: {
      connectTimeout: 60000,
    },
  });

// In development, save the instance to the global object to prevent
// connection leaks during hot-reloading.
if (process.env.NODE_ENV !== "production") {
  globalForRedis.redisClient = redisClient;
}

// Connection
redisClient
  .connect()
  .then(() => {
    console.info("✅ Successfully connected to Redis!");
  })
  .catch((error: unknown) => {
    console.error("❌ Redis Connection Error:", error);
    process.exit(1);
  });

export default redisClient;
