import { PrismaClient } from "@/generated/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { attachDatabasePool } from "@vercel/functions";

// Extend globalThis
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create pool (Vercel Postgres)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Attach pool (important for Vercel serverless)
attachDatabasePool(pool);

// Create Prisma client (singleton)
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    //@ts-expect-error
    adapter: new PrismaPg(pool),
  });

// Prevent multiple instances in dev
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;