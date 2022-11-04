import mailchimp from '@mailchimp/mailchimp_marketing';
import { z } from 'zod';
import { env } from '../../utils/env';
import { createRouter } from './context';

mailchimp.setConfig({
	apiKey: env.MAILCHIMP_API_KEY,
	server: env.MAILCHIMP_API_SERVER, // e.g. us1
});

export const mailingListRouter = createRouter().mutation('subscribe', {
	input: z.object({
		email: z.string(),
	}),
	async resolve({ input }) {
		const AUDIENCE_ID = env.MAILCHIMP_AUDIENCE_ID ?? '';
		try {
			await mailchimp.lists.addListMember(AUDIENCE_ID, {
				email_address: input.email,
				status: 'subscribed',
			});

			return { success: true };
		} catch (error: any) {
			console.debug(error);
			return { success: false, error: error.message || error.toString() };
		}
	},
});
