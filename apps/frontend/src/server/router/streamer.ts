import { z } from 'zod';
import { createRouter } from './context';

export const streamerRouter = createRouter()
	.query('get-streamer', {
		input: z.string(),
		resolve: async ({ ctx, input }) => {
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
		},
	})
	.mutation('update-streamer-config', {
		input: z.object({
			streamerId: z.string(),
			config: z.object({
				channelPointsName: z.string(),
				channelPointsEnabled: z.boolean(),

				maxMsgLength: z.number(),
				minBitAmount: z.number(),
				minTipAmount: z.number(),
				minMonthsAmount: z.number(),

				blacklistedWords: z.array(z.string()),
				blacklistedVoices: z.array(z.string()),
				blacklistedUsers: z.array(z.string()),

				fallbackVoice: z.string(),
			}),
		}),
		resolve: async ({ ctx, input }) => {
			const { streamerId, config } = input;
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
		},
	});
