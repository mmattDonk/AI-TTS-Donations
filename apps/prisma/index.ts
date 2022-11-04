import { PrismaClient } from '@prisma/client';
import { envsafe, str } from 'envsafe';

const env = envsafe({
	DATABASE_URL: str({
		// idek if this works but oh well
		desc: 'Prisma URL (unused, just meant to ensure that the prisma url is in .env)',
	}),
});
console.log(env.DATABASE_URL);

const prismaClient = new PrismaClient({
	log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});
export const prisma = prismaClient;
