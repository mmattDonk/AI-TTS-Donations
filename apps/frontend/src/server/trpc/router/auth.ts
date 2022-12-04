import { protectedProcedure, router } from '../trpc';

export const authRouter = router({
	getSession: protectedProcedure.query(({ ctx }) => {
		return ctx.session;
	}),
});
