import { withSentry } from '@sentry/nextjs';
import { createNextApiHandler } from '@trpc/server/adapters/next';

import { createContext } from '../../../server/trpc/context';
import { appRouter } from '../../../server/trpc/router/_app';
import { env } from '../../../utils/env';

// export API handler
export default withSentry(
	createNextApiHandler({
		router: appRouter,
		createContext,
		onError:
			env.NODE_ENV === 'development'
				? ({ path, error }) => {
						console.error(`❌ tRPC failed on ${path}: ${error}`);
				  }
				: undefined,
	})
);
