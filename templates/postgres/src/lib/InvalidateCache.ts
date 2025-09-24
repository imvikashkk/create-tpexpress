import redisClient from "@/config/dbs/redis.js";

const InvalidateCache = async (pattern: string) => {
  let cursor: string | null = "0"; // Initialize cursor as a string or null

  do {
    // Correctly destructure the object returned by the scan method
    const result = await redisClient.scan(cursor, {
      MATCH: pattern,
      COUNT: 1000,
    });

    // The result object has 'cursor' and 'keys' properties
    const nextCursor = result.cursor;
    const keys = result.keys;

    // If any keys were found, delete them
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

    // Update the cursor for the next iteration
    cursor = nextCursor;
  } while (cursor !== "0");
};

export default InvalidateCache;
