import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import env from '@/config/env.js';

// Create Connection Pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Global singleton for Drizzle instance
const globalForDrizzle = global as unknown as {
  db: NodePgDatabase | undefined;
  dbConnectPromise: Promise<void> | undefined;
};

// Use existing Drizzle instance if available
const db = globalForDrizzle.db ?? drizzle(pool);
if (process.env.NODE_ENV !== 'production') {
  globalForDrizzle.db = db;
}

// Flag to track connection
let isConnected = false;

// ConnectDB function (race-condition safe)
const connectDB = async () => {
  if (isConnected) {
    console.info(`ℹ️ Database already connected PID:${process.pid}`);
    return;
  }

  // Avoid parallel calls race
  if (globalForDrizzle.dbConnectPromise) {
    await globalForDrizzle.dbConnectPromise;
    return;
  }

  globalForDrizzle.dbConnectPromise = (async () => {
    try {
      const client = await pool.connect();
      console.log(`✅ Database connected successfully PID:${process.pid}`);

      // Release client immediately; Drizzle uses pool internally
      client.release();

      isConnected = true;

      // Log pool status
      // console.log(
      //   `🔹 Pool status → total: ${pool.totalCount}, idle: ${pool.idleCount}, waiting: ${pool.waitingCount}`
      // );
    } catch (error) {
      console.error(`❌ Database connection Error PID:${process.pid}`);
      console.error(error);
      process.exit(1);
    } finally {
      globalForDrizzle.dbConnectPromise = undefined;
    }
  })();

  await globalForDrizzle.dbConnectPromise;
};

export default db;
export { connectDB };
