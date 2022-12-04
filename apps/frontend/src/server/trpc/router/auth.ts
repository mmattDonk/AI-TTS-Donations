import { publicProcedure, router } from '../trpc';

export const authRouter = router({
	getSession: publicProcedure.query(({ ctx }) => {
		return ctx.session;
	}),
});
