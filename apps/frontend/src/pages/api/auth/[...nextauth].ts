import NextAuth, { User, type NextAuthOptions } from 'next-auth';
import TwitchProvider from 'next-auth/providers/twitch';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { withSentry } from '@sentry/nextjs';
import { prisma } from '@solrock/prisma';

async function createStreamerIfNotExists(user: User) {
	if (
		!(await prisma.streamer.findFirst({
			where: {
				id: user.id,
			},
		}))
	) {
		await prisma.streamer.create({
			data: {
				id: user.id,
			},
		});
	}
}

export const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		TwitchProvider({
			clientId: process.env.TWITCH_ID ?? '',
			clientSecret: process.env.TWITCH_SECRET ?? '',
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
			await prisma.streamer.create({
				data: {
					id: user.user.id,
				},
			});
		},
		updateUser: async (user) => {
			await createStreamerIfNotExists(user.user);
		},
		signIn: async (user) => {
			await createStreamerIfNotExists(user.user);
			if (!user.isNewUser) return;
			await fetch(process.env.EVENTSUB_API_URL + '/newuser', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + process.env.API_SECRET,
				},
				body: JSON.stringify({
					streamerAuth: user.account?.access_token,
					streamerId: user.account.providerAccountId,
				}),
			});
		},
	},
};

export default withSentry(NextAuth(authOptions));
