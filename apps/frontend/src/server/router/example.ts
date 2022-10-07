import { z } from 'zod';
import { createRouter } from './context';

export const exampleRouter = createRouter()
	.query('hello', {
		input: z
			.object({
				text: z.string().nullish(),
			})
			.nullish(),
		resolve({ input }) {
			return {
				greeting: `Hello ${input?.text ?? 'world'}`,
			};
		},
	})
	.query('xd', {
		input: z.object({
			username: z.string(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.user.findFirst({
				where: {
					name: input.username,
				},
			});
		},
	});
