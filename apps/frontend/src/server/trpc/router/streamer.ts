import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

export const streamerRouter = router({
	getStreamer: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
		return await ctx.prisma.streamer.findFirst({
			where: {
				user: {
					name: input,
				},
			},
			include: {
				user: true,
				config: true,
				ttsmessages: true,
			},
		});
	}),
	updateStreamerConfig: protectedProcedure
		.input(
			z.object({
				streamerId: z.string(),
				config: z.object({
					channelPointsName: z.string(),
					channelPointsEnabled: z.boolean(),

					bitsEnabled: z.boolean(),
					resubsEnabled: z.boolean(),

					maxMsgLength: z.number(),
					minBitAmount: z.number(),
					minTipAmount: z.number(),
					minMonthsAmount: z.number(),

					blacklistedWords: z.array(z.string()),
					blacklistedVoices: z.array(z.string()),
					blacklistedUsers: z.array(z.string()),

					fallbackVoice: z.string(),
				}),
			})
		)
		.mutation(async ({ ctx, input }) => {
			let { streamerId, config } = input;
			config = {
				...config,
				blacklistedWords: config.blacklistedWords.filter((w) => w !== ''),
				blacklistedVoices: config.blacklistedVoices.filter((w) => w !== ''),
				blacklistedUsers: config.blacklistedUsers.filter((w) => w !== ''),
			};
			return await ctx.prisma.streamerConfig.upsert({
				where: {
					id: streamerId,
				},
				update: {
					...config,
				},
				create: {
					id: streamerId,
					...config,
				},
			});
		}),
});
