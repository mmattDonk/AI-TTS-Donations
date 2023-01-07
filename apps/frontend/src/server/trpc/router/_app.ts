// mmattDonk 2023
// https://mmattDonk.com

// this file was mostly generated from create-t3-app https://create.t3.gg
import { router } from '../trpc';
import { authRouter } from './auth';
import { streamerRouter } from './streamer';
import { ttsRouter } from './tts';
import { userRouter } from './user';

export const appRouter = router({
	auth: authRouter,
	user: userRouter,
	tts: ttsRouter,
	streamer: streamerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
