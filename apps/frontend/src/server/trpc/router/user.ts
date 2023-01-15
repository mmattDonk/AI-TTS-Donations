// mmattDonk 2023
// https://mmattDonk.com

import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const userRouter = router({
	getUser: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		return await ctx.prisma.user.findFirst({
			where: {
				name: input,
			},
			include: {
				accounts: true,
				sessions: true,
				streamers: true,
			},
		});
	}),
});
