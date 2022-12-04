import { router } from '../trpc';
import { authRouter } from './auth';
import { mailingListRouter } from './mailing-list';
import { streamerRouter } from './streamer';
import { ttsRouter } from './tts';
import { userRouter } from './user';

export const appRouter = router({
	auth: authRouter,
	mailingList: mailingListRouter,
	user: userRouter,
	tts: ttsRouter,
	streamer: streamerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
