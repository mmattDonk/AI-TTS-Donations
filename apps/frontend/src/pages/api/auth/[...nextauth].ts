// mmattDonk 2023
// https://mmattDonk.com

// this file was mostly generated from create-t3-app https://create.t3.gg
import NextAuth, { User, type NextAuthOptions } from 'next-auth';
import TwitchProvider from 'next-auth/providers/twitch';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { withSentry } from '@sentry/nextjs';
import { env } from '../../../utils/env';
import prismaClient from '../../../utils/prisma';

async function createStreamerIfNotExists(user: User) {
	if (
		!(await prismaClient.streamer.findFirst({
			where: {
				id: user.id,
			},
		}))
	) {
		await prismaClient.streamer.create({
			data: {
				id: user.id,
			},
		});
	}
}

export const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prismaClient),
	secret: env.NEXTAUTH_SECRET,
	providers: [
		TwitchProvider({
			clientId: env.TWITCH_ID ?? '',
			clientSecret: env.TWITCH_SECRET ?? '',
			authorization: {
				params: {
					scope: 'openid user:read:email channel:read:redemptions channel:read:subscriptions bits:read',
				},
			},
		}),
		// ...add more providers here
	],
	events: {
		createUser: async (user) => {
			const twitchUserData = await fetch('https://api.ivr.fi/v2/twitch/user?login=' + user.user.name);
			const twitchUserDataJson = await twitchUserData.json();
			const [streamerCreate, userUpdate] = await Promise.all([
				prismaClient.streamer.create({
					data: {
						id: user.user.id,
					},
				}),
				prismaClient.user.update({
					where: {
						id: user.user.id,
					},
					data: {
						twitchPartner: twitchUserDataJson[0].roles.isPartner,
					},
				}),
			]);
			await fetch(env.DISCORD_WEBHOOK_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					content: `New user: https://twitch.tv/${user.user.name} ${twitchUserDataJson[0].roles.isPartner ? '<@308000668181069824> new twitch partner!' : ''}`,
				}),
			});
		},
		updateUser: async (user) => {
			await createStreamerIfNotExists(user.user);
		},
		signIn: async (user) => {
			await createStreamerIfNotExists(user.user);
			if (!user.isNewUser) return;
			await fetch(env.EVENTSUB_API_URL + '/newuser', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + env.API_SECRET,
				},
				body: JSON.stringify({
					streamerId: user.account?.providerAccountId,
				}),
			});
		},
	},
};

export default withSentry(NextAuth(authOptions));
