import { PrismaClient } from "@prisma/client";

// 全局 Prisma 实例（避免重复连接）
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}