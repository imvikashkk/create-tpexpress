import mongoose from "mongoose";
import env from "@/config/env.js";

// Define a type for the global object to hold the Mongoose connection.
const globalForMongoose = global as unknown as {
  mongoose: typeof mongoose | undefined;
};

// Check if a Mongoose connection has already been established.
// If it has, reuse the existing instance.
const db = globalForMongoose.mongoose ?? mongoose;

// In development, save the instance to the global object to prevent
// connection leaks during hot-reloading.
if (env.NODE_ENV !== "production") {
  globalForMongoose.mongoose = db;
}

async function mongooseConnect() {
  try {
    // Mongoose's connect method is designed to be called once.
    console.log(env.DATABASE_URL);
    await db.connect(env.DATABASE_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.info("✅ Database connection successful!");
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
}

// Export the mongoose connection instance
export default db;

// Export the connection check function
export { mongooseConnect };
