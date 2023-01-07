// mmattDonk 2023
// https://mmattDonk.com

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const userRouter = router({
	getUser: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
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
