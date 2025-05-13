import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to SQLite database");
  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
};
