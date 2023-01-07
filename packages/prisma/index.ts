// author: @t3-oss: https://github.com/t3-oss/create-t3-turbo/blob/main/packages/db/index.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
	log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
// mmattDonk 2023
// https://mmattDonk.com

export * from '@prisma/client';

if (process.env.NODE_ENV !== 'production') {
	prisma;
}
