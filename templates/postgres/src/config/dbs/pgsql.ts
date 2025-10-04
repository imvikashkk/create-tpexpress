import { Pool } from 'pg';
import env from '@/config/env.js';

// Create Connection Pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Global singleton to prevent multiple pools in dev hot-reloading
const globalForPostgres = global as unknown as {
  postgresPool: Pool | undefined;
  dbConnectPromise: Promise<void> | undefined;
};

// Use existing pool if available
const db = globalForPostgres.postgresPool ?? pool;
if (process.env.NODE_ENV !== 'production') {
  globalForPostgres.postgresPool = db;
}

// Pre-setup SQL (tables + triggers)
const preSetupQueryString = `
-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL NOT NULL PRIMARY KEY,
  fname VARCHAR(100) NOT NULL,
  lname VARCHAR(100),
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- Credentials table
CREATE TABLE IF NOT EXISTS credentials (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  hash VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE TRIGGER credentials_updated_at_trigger
BEFORE UPDATE ON credentials
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();
`;

// Flag to track connection
let isConnected = false;

// ConnectDB function (race-condition safe)
const connectDB = async () => {
  if (isConnected) {
    console.info(`ℹ️ Database already connected PID:${process.pid}`);
    return;
  }

  // Avoid parallel calls race
  if (globalForPostgres.dbConnectPromise) {
    await globalForPostgres.dbConnectPromise;
    return;
  }

  globalForPostgres.dbConnectPromise = (async () => {
    try {
      const client = await db.connect();
      console.log(`✅ Database connected successfully PID:${process.pid}`);

      // Run pre-setup queries only once
      await client.query(preSetupQueryString);
      client.release();

      isConnected = true;

      // Log pool status
      // console.log(
      //   `🔹 Pool status → total: ${db.totalCount}, idle: ${db.idleCount}, waiting: ${db.waitingCount}`
      // );
    } catch (error) {
      console.error(`❌ Database connection Error PID:${process.pid}`);
      console.error(error);
      process.exit(1);
    } finally {
      globalForPostgres.dbConnectPromise = undefined;
    }
  })();

  await globalForPostgres.dbConnectPromise;
};

export default db;
export { connectDB };
