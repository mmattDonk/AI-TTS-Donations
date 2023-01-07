// mmattDonk 2023
// https://mmattDonk.com

// this file was mostly generated from create-t3-app https://create.t3.gg
import { type GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { authOptions } from '../../pages/api/auth/[...nextauth]';

/**
 * Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs
 * See example usage in trpc createContext or the restricted API route
 */
export const getServerAuthSession = async (ctx: { req: GetServerSidePropsContext['req']; res: GetServerSidePropsContext['res'] }) => {
	return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
};
