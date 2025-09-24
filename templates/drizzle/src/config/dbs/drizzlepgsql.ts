import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import env from "@/config/env.js";

// Define a type for the global object to hold the Drizzle instance.
const globalForDrizzle = global as unknown as {
  db: NodePgDatabase | undefined;
};

// Check if a Drizzle instance already exists. If not, create a new one.
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const db = globalForDrizzle.db ?? drizzle(pool);

// In development, save the instance to the global object.
if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.db = db;
}

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully!");
    client.release();
  } catch (error) {
    console.error("❌ Failed to connect to the database.");
    console.error(error);
    process.exit(1);
  }
};

export { connectDB };
export default db;
