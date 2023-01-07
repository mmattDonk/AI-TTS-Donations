// mmattDonk 2023
// https://mmattDonk.com

import { envsafe, str, url, num } from 'envsafe';

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
	SOKETI_URL: str({
		desc: 'soketi url, hosted on railway',
	}),
	SOKETI_PORT: num({
		desc: 'soketi port, hosted on railway',
	}),
	SOKETI_APP_ID: str(),
	SOKETI_APP_SECRET: str(),
	SOKETI_APP_KEY: str(),
	SERVERLESS_PROCESSOR_URL: url({
		desc: 'The serverless Python Processor URL',
		devDefault: 'http://127.0.0.1:8080',
	}),
	DISCORD_WEBHOOK_URL: url({}),
});
