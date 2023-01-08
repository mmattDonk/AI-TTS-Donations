// mmattDonk 2023
// https://mmattDonk.com

// this file was mostly generated from create-t3-app https://create.t3.gg
import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { type Session } from 'next-auth';
import Pusher from 'pusher';
import { env } from '../../utils/env';
import prismaClient from '../../utils/prisma';
import { getServerAuthSession } from '../common/get-server-auth-session';

type CreateContextOptions = {
	session: Session | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
	const pusher = new Pusher({
		appId: env.PUSHER_APP_ID,
		cluster: env.PUSHER_APP_CLUSTER,
		key: env.PUSHER_APP_KEY,
		secret: env.PUSHER_APP_SECRET,
	});

	return {
		session: opts.session,
		prisma: prismaClient,
		pusher,
	};
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
	const { req, res } = opts;

	// Get the session from the server using the unstable_getServerSession wrapper function
	const session = await getServerAuthSession({ req, res });

	return await createContextInner({
		session,
	});
};

export type Context = inferAsyncReturnType<typeof createContext>;
