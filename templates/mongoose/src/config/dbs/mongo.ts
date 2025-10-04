import mongoose from 'mongoose';
import env from '@/config/env.js';

// Global singleton for Mongoose
const globalForMongoose = global as unknown as {
  mongooseInstance: typeof mongoose | undefined;
  dbConnectPromise: Promise<void> | undefined;
};

// Use existing Mongoose instance if available
const db = globalForMongoose.mongooseInstance ?? mongoose;

// In development, save instance to global to prevent hot reload issues
if (env.NODE_ENV !== 'production') {
  globalForMongoose.mongooseInstance = db;
}

// ConnectDB function (race-condition safe)
const connectDB = async () => {
  if (db.connection.readyState === 1) {
    console.info(`ℹ️ MongoDB already connected PID:${process.pid}`);
    return;
  }

  // Avoid race conditions
  if (globalForMongoose.dbConnectPromise) {
    await globalForMongoose.dbConnectPromise;
    return;
  }

  globalForMongoose.dbConnectPromise = (async () => {
    try {
      await db.connect(env.DATABASE_URL, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ Database connected successfully PID:${process.pid}`);
    } catch (error) {
      console.error(`❌ Database connection Error PID:${process.pid}`);
      console.error(error);
      process.exit(1);
    } finally {
      globalForMongoose.dbConnectPromise = undefined;
    }
  })();

  await globalForMongoose.dbConnectPromise;
};

export default db;
export { connectDB };
