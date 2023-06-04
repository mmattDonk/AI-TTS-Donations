// mmattDonk 2023
// https://mmattDonk.com

import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const streamerRouter = router({
	getStreamer: protectedProcedure.query(async ({ ctx, input }) => {
		// TODO: fix ctx.prisma returning no types?
		return await ctx.prisma.streamer.findFirst({
			where: {
				user: {
					name: ctx.session.user.name,
				},
			},
			include: {
				user: true,
				config: true,
				ttsmessages: false,
			},
		});
	}),
	updateStreamerConfig: protectedProcedure
		.input(
			// TODO: gotta be a better way to do this vvv
			// like pull it from the `streamer` schema on prisma or something
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
					blacklistedVoiceEffects: z.array(z.string()),

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
				blacklistedVoiceEffects: config.blacklistedVoiceEffects.filter((w) => w !== '').map((w) => w.toLowerCase()),
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
