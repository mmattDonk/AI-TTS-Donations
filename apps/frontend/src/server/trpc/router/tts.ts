// mmattDonk 2023
// https://mmattDonk.com

import { z } from 'zod';
import { env } from '../../../utils/env';
import { protectedProcedure, publicProcedure, router } from '../trpc';

export const ttsRouter = router({
	retriggerTts: protectedProcedure
		.input(
			z.object({
				audioUrl: z.string(),
				overlayId: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { audioUrl, overlayId } = input;
			const { pusher, prisma } = ctx;
			const audioUrlResponse = await fetch(audioUrl);
			const audioStatus = audioUrlResponse.status;
			if (audioStatus !== 200) {
				const message = await prisma.ttsMessages.findFirst({
					where: {
						audioUrl: audioUrl,
					},
				});
				if (!message) return;
				await fetch(env.SERVERLESS_PROCESSOR_URL, {
					body: JSON.stringify({
						message: message.message,
						overlayId: overlayId,
					}),
					headers: { Authorization: 'Bearer ' + env.API_SECRET, 'Content-Type': 'application/json' },
					method: 'POST',
				});
				// TODO: update old message with new audioUrl
				return;
			}
			try {
				pusher.trigger(overlayId, 'skip-tts', {});
				pusher.trigger(overlayId, 'new-file', { file: audioUrl });
			} catch (e) {
				return {
					success: false,
				};
			}

			return {
				success: true,
			};
		}),
	skipTts: protectedProcedure
		.input(
			z.object({
				overlayId: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { overlayId } = input;
			const { pusher } = ctx;
			try {
				await pusher.trigger(overlayId, 'skip-tts', {});
			} catch (e) {
				console.log(e);
				return {
					success: false,
				};
			}
			return {
				success: true,
			};
		}),
	getRecentMessages: publicProcedure
		.input(
			z.object({
				streamerId: z.string(),
			})
		)
		.query(async ({ input, ctx }) => {
			const { streamerId } = input;
			const { prisma } = ctx;
			if (!streamerId)
				return {
					success: false,
					message: 'streamer not found',
				};
			const messages = await prisma.ttsMessages.findMany({
				where: {
					streamerId,
				},
				orderBy: {
					createdAt: 'desc',
				},
			});
			if (!messages) return { success: true, messages: null };
			return { success: true, messages: messages };
		}),
});
