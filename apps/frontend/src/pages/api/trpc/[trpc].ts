// src/pages/api/trpc/[trpc].ts
import { withSentry } from '@sentry/nextjs';
import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/router';
import { createContext } from '../../../server/router/context';

// export API handler
export default withSentry(
	createNextApiHandler({
		router: appRouter,
		createContext: createContext,
	})
);
