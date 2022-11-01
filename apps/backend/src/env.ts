import { envsafe, num, str, url } from 'envsafe';

export const env = envsafe(
	{
		PORT: num({
			desc: 'port to run the backend server on',
			allowEmpty: true,
			devDefault: 4200,
			default: 4200,
		}),
		API_URL: url({
			desc: 'Next.js URL',
			devDefault: 'http://localhost:3000',
		}),
		API_SECRET: str({
			// TODO: make this global
			desc: 'API secret (shared across backend, frontend, and processor)',
		}),
		SERVERLESS_PROCESSOR_URL: url({
			desc: 'Processor URL',
			devDefault: 'http://localhost:8080',
		}),
		CLIENT_ID: str({
			desc: '(client id) get this from dev.twitch.tv',
		}),
		TWITCH_ACCESS_TOKEN: str({
			desc: '(twitch access token) you get this from an api request',
			// TODO: put link to the api request
		}),
		EVENTSUB_SECRET: str({
			desc: 'randomly generated, meant for twitch eventsub verification',
			devDefault: 'superdanksecretdotcom',
		}),
	},
	{ strict: true }
);
