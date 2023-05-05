// mmattDonk 2023
// https://mmattDonk.com

import { protectedProcedure, router } from '../trpc';

export const userRouter = router({
	getUser: protectedProcedure.query(async ({ ctx, input }) => {
		return await ctx.prisma.user.findFirst({
			where: {
				name: ctx.session.user.name,
			},
			include: {
				accounts: true,
				sessions: true,
				streamers: true,
			},
		});
	}),
});
