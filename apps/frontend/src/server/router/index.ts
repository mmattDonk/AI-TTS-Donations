// src/server/router/index.ts
import superjson from 'superjson';
import { createRouter } from './context';

import { authRouter } from './auth';
import { exampleRouter } from './example';
import { mailingListRouter } from './mailing-list';
import { ttsRouter } from './tts';
import { userRouter } from './user';

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('example.', exampleRouter)
	.merge('auth.', authRouter)
	.merge('mailing-list.', mailingListRouter)
	.merge('user.', userRouter)
	.merge('tts.', ttsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
