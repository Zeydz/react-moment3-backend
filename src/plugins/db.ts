import "dotenv/config";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/*
	Prisma v7 uses `prisma.config.ts` for datasource URLs.
	If you later use a specific adapter (e.g. a postgres adapter package),
	pass it to `new PrismaClient({ adapter })` here. For now instantiate
	the client directly so the config file provides the connection URL.
*/

const adapter = new PrismaPg( {
    connectionString: process.env.DATABASE_URL
});

export const prisma = new PrismaClient({adapter});