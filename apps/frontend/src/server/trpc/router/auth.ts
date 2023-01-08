// mmattDonk 2023
// https://mmattDonk.com

// this file was generated from create-t3-app https://create.t3.gg
import { publicProcedure, router } from '../trpc';

export const authRouter = router({
	getSession: publicProcedure.query(({ ctx }) => {
		return ctx.session;
	}),
});
