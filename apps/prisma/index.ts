import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});
export const prisma = prismaClient;
