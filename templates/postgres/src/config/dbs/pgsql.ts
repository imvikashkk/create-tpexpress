import { Client } from "pg";
import env from "@/config/env.js";

// Define a type for the global object to hold the single client instance
const globalForPostgres = global as unknown as {
  postgresClient: Client | undefined;
};

// Check if a client instance already exists, otherwise create a new one
const client =
  globalForPostgres.postgresClient ??
  new Client({
    connectionString: env.DATABASE_URL,
  });

// In development, save the instance to the global object to prevent
// connection leaks during hot-reloading.
if (process.env.NODE_ENV !== "production") {
  globalForPostgres.postgresClient = client;
}

const connectDB = async () => {
  try {
    await client.connect();
    console.info("✅ PostgreSQL connected successfully!");

    // Execute the schema setup queries
    await client.query(preSetupQueryString);
    console.info("✅ Database schema setup complete!");
  } catch (error) {
    console.error("❌ PostgreSQL connection error:", error);
    process.exit(1);
  }
};

const preSetupQueryString = `
-- Reusable function to set the updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--------------------------------------------------------------------------------

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL NOT NULL PRIMARY KEY,
  fname VARCHAR(100) NOT NULL,
  lname VARCHAR(100),
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for the users table
CREATE OR REPLACE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

--------------------------------------------------------------------------------

-- Create the credentials table
CREATE TABLE IF NOT EXISTS credentials (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  hash VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for the credentials table
CREATE OR REPLACE TRIGGER credentials_updated_at_trigger
BEFORE UPDATE ON credentials
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();
`;

export default client;
export { connectDB };
