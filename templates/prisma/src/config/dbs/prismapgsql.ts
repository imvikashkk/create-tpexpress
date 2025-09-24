import { PrismaClient } from "@prisma/client";
import env from "@/config/env.js";

// This global variable will hold our single PrismaClient instance.
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if a PrismaClient instance already exists on the global object.
// If it does, reuse it. Otherwise, create a new one.
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In development, save the instance to the global object.
// This prevents new instances from being created on hot-reloads.
if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

async function prismaConnectionCheck() {
  try {
    // A simple query to check the database connection
    await prisma.$queryRaw`SELECT 1`;
    console.info("✅ Database connection successful!");
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
}

export default prisma;
export { prismaConnectionCheck };
