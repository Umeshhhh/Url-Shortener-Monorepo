import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env";

if (!env.databaseUrl) {
    throw new Error("DATABASE_URL is required");
}

const connectionString  = env.databaseUrl;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient( { adapter } );

export default prisma;
