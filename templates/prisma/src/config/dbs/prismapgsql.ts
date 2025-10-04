import { PrismaClient } from '@prisma/client';
import env from '@/config/env.js';

// Global singleton for PrismaClient
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  dbConnectPromise: Promise<void> | undefined;
};

// Use existing Prisma instance if available
const prisma = globalForPrisma.prisma ?? new PrismaClient();

// In development, save the instance to the global object to prevent hot reload issues
if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Flag to track connection
let isConnected = false;

// ConnectDB function (race-condition safe)
const connectDB = async () => {
  if (isConnected) {
    console.info(`ℹ️ Database already connected PID:${process.pid}`);
    return;
  }

  // Avoid race conditions for multiple parallel calls
  if (globalForPrisma.dbConnectPromise) {
    await globalForPrisma.dbConnectPromise;
    return;
  }

  globalForPrisma.dbConnectPromise = (async () => {
    try {
      // Simple query to check connection
      await prisma.$queryRaw`SELECT 1`;
      console.log(`✅ Database connected successfully PID:${process.pid}`);
      isConnected = true;
    } catch (error) {
      console.error(`❌ Database connection Error PID:${process.pid}`);
      console.error(error);
      process.exit(1);
    } finally {
      globalForPrisma.dbConnectPromise = undefined;
    }
  })();

  await globalForPrisma.dbConnectPromise;
};

export default prisma;
export { connectDB };
