import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.PRISMA_URL_DATA_BASE,
});
export const prisma = new PrismaClient({
  adapter,
});

export default prisma;
