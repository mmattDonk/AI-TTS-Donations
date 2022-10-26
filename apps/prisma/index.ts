import { PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge';

const prismaClient = new PrismaClient({
	log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});
const edgePrismaClient = new PrismaClientEdge({
	log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});
export const prisma = prismaClient;
export const edgePrisma = edgePrismaClient;
