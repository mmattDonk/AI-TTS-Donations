// mmattDonk 2023
// https://mmattDonk.com

import { envsafe, str, url } from 'envsafe';

export const env = envsafe({
	NEXTAUTH_SECRET: str({
		desc: 'a randomly generated secret meant from encryption (i think?)',
		devDefault: 'secret',
	}),
	NODE_ENV: str({
		desc: 'the environment the app is running in',
	}),
	API_SECRET: str({
		// TODO: make this a global env thing
		desc: 'secret meant for the backend api, the processor, and the next.js api. share this api secret with both.',
		devDefault: 'secret',
	}),
	TWITCH_ID: str({
		desc: '(client id) get this from dev.twitch.tv (for sign in with twitch)',
	}),
	TWITCH_SECRET: str({
		desc: '(client secret) get this from dev.twitch.tv (for sign in with twitch)',
	}),
	EVENTSUB_API_URL: url({
		desc: "the backend server's URL",
		devDefault: 'http://localhost:4200',
	}),
	PUSHER_APP_KEY: str({
		desc: 'get this from pusher.com (for overlay connection)',
	}),
	PUSHER_APP_CLUSTER: str({
		desc: 'get this from pusher.com (for overlay connection)',
	}),
	PUSHER_APP_ID: str({
		desc: 'get this from pusher.com (for overlay connection)',
	}),
	PUSHER_APP_SECRET: str({
		desc: 'get this from pusher.com (for overlay connection)',
	}),
	MAILCHIMP_API_KEY: str({
		desc: 'get this from mailchimp.com (used for email signups, not neaded most of the time)',
		allowEmpty: true,
	}),
	MAILCHIMP_API_SERVER: str({
		desc: 'get this from mailchimp.com (used for email signups, not neaded most of the time)',
		allowEmpty: true,
	}),
	MAILCHIMP_AUDIENCE_ID: str({
		desc: 'get this from mailchimp.com (used for email signups, not neaded most of the time)',
		allowEmpty: true,
	}),
	SERVERLESS_PROCESSOR_URL: url({
		desc: 'The serverless Python Processor URL',
		devDefault: 'http://127.0.0.1:8080',
	}),
	DISCORD_WEBHOOK_URL: url({}),
});
