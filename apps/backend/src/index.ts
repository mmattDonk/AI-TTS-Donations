import crypto from 'crypto';
import dotenv from 'dotenv';
import { envsafe, num, str, url } from 'envsafe';
import fastify, { FastifyRequest } from 'fastify';
import fetch from 'node-fetch';
import { cheerEvent, redemptionEvent, streamer, subscriptionEvent } from './typings';
const app = fastify();
dotenv.config();

const env = envsafe({
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
		desc: '(twitch access token) you get this from an api request - https://dev.twitch.tv/docs/cli/token-command#get-an-access-token',
	}),
	EVENTSUB_SECRET: str({
		desc: 'randomly generated, meant for twitch eventsub verification',
		devDefault: 'superdanksecretdotcom',
	}),
});

// port
const PORT = env.PORT || 4200;

// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = 'sha256=';

// next.js api base url
const API_URL = env.API_URL ?? 'http://localhost:3000';
const SERVERLESS_PROCESSOR_URL = env.SERVERLESS_PROCESSOR_URL ?? 'http://localhost:8080';

async function processEvent(broadcasterId: string, message: string, streamerJson: streamer) {
	if (message.length > streamerJson.streamer.config[0].maxMsgLength) return;
	console.log('STREAMER JSON', streamerJson);

	if (streamerJson) {
		console.log('EVENT MESSAGE???', message);
		console.log('STRAEMER OVERLAY?', streamerJson.streamer.overlayId);
		await fetch(SERVERLESS_PROCESSOR_URL, {
			body: JSON.stringify({
				message: message,
				overlayId: streamerJson.streamer.overlayId,
			}),
			headers: { Authorization: 'Bearer ' + env.API_SECRET, 'Content-Type': 'application/json' },
			method: 'POST',
		});
		return;
	} else {
		console.error('Streamer not found');
		return;
	}
}

async function subscriptionCallback(event: subscriptionEvent, streamerJson: streamer) {
	// vvvv this was breaking for some reason /shrug TODO: fix
	// if (!streamerJson?.streamer?.config[0]?.minMonthsAmount) return;
	if (streamerJson.streamer.config[0].resubsEnabled === false) return;
	if (streamerJson.streamer.config[0].minMonthsAmount > event.duration_months) return;
	if (event.user_name.toLowerCase() in streamerJson.streamer.config[0].blacklistedUsers) return;

	console.log('USER SUB', event.user_login);

	await processEvent(event.broadcaster_user_id, event.message.text, streamerJson);
	console.log('subscriptionCallback', event);
}

async function cheerCallback(event: cheerEvent, streamerJson: streamer) {
	// vvvv this was breaking for some reason /shrug TODO: fix
	// if (!streamerJson?.streamer?.config[0]?.minBitAmount) return;
	if (streamerJson.streamer.config[0].bitsEnabled === false) return;
	if (streamerJson.streamer.config[0].minBitAmount > event.bits) return;
	if (event.user_name.toLowerCase() in streamerJson.streamer.config[0].blacklistedUsers) return;

	console.log('USER CHEER', event.user_login);

	await processEvent(event.broadcaster_user_id, event.message, streamerJson);
	console.log('cheerCallback', event);
}

async function redemptionCallback(event: redemptionEvent, streamerJson: streamer) {
	if (!streamerJson?.streamer?.config[0]?.channelPointsName) return;
	if (streamerJson.streamer.config[0].channelPointsEnabled === false) return;
	if (streamerJson.streamer.config[0].channelPointsName !== event.reward.title) return;
	if (event.user_name.toLowerCase() in streamerJson.streamer.config[0].blacklistedUsers) return;

	console.log('USER REDEEM', event.user_login);

	await processEvent(event.broadcaster_user_id, event.user_input, streamerJson);
}

app.post('/eventsub', async (req, res) => {
	let secret = getSecret();
	let message = getHmacMessage(req);
	let hmac = HMAC_PREFIX + getHmac(secret, message); // Signature to compare

	if (true === verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
		console.log('signatures match');

		// Get JSON object from body, so you can process the message.
		let notification = req.body as any;

		if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
			console.log(`Event type: ${notification.subscription.type}`);
			const streamer = await fetch(API_URL + '/api/streamers/streamerId/' + notification.event.broadcaster_user_id, {
				headers: { secret: env.API_SECRET ?? '', 'Content-Type': 'application/json' },
				method: 'GET',
			});
			const streamerJson = (await streamer.json()) as streamer;
			if (streamer.status !== 200) {
				console.error('Streamer not found');
				res.send(404).status(404);
				return;
			}
			console.log(streamerJson.streamer.user.name, notification);
			if (notification.subscription.type === 'channel.subscription.message') {
				res.send('success!').status(204);
				await subscriptionCallback(notification.event, streamerJson);
			} else if (notification.subscription.type === 'channel.cheer') {
				res.send('success!').status(204);
				await cheerCallback(notification.event, streamerJson);
			} else if (notification.subscription.type === 'channel.channel_points_custom_reward_redemption.add') {
				res.send('success!').status(204);
				await redemptionCallback(notification.event, streamerJson);
			} else console.log(JSON.stringify(notification.event, null, 4));
		} else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
			res.send(notification.challenge).status(200);
		} else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
			res.send(204).status(200);

			console.log(`${notification.subscription.type} notifications revoked!`);
			console.log(`reason: ${notification.subscription.status}`);
			console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
		} else {
			res.send(204);
			console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
		}
	} else {
		console.log('403'); // Signatures didn't match.
		res.send(403);
	}
});

app.post('/newuser', async (req, res) => {
	const data = req.body as { streamerId: string };
	console.log('new user!', data.streamerId);
	// if bearer token not equal to env.secret
	const secret = req.headers.authorization?.split(' ')[1];
	if (secret !== env.API_SECRET) {
		console.log('rejected :p');
		return res.status(403).send('Forbidden');
	}

	const [subscribeResub, subscribeCheers, subscribeReward] = await Promise.all([
		fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
			body: JSON.stringify({
				type: 'channel.subscription.message',
				version: '1',
				condition: { broadcaster_user_id: data.streamerId },
				transport: {
					method: 'webhook',
					callback: 'https://eventsub.solrock.mmattdonk.com/eventsub',
					secret: env.API_SECRET,
				},
			}),
			headers: {
				'Client-Id': env.CLIENT_ID ?? '',
				Authorization: 'Bearer ' + env.TWITCH_ACCESS_TOKEN,
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}),
		fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
			body: JSON.stringify({
				type: 'channel.cheer',
				version: '1',
				condition: { broadcaster_user_id: data.streamerId },
				transport: {
					method: 'webhook',
					callback: 'https://eventsub.solrock.mmattdonk.com/eventsub',
					secret: env.API_SECRET,
				},
			}),
			headers: {
				'Client-Id': env.CLIENT_ID ?? '',
				Authorization: 'Bearer ' + env.TWITCH_ACCESS_TOKEN,
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}),
		fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
			body: JSON.stringify({
				type: 'channel.channel_points_custom_reward_redemption.add',
				version: '1',
				condition: { broadcaster_user_id: data.streamerId },
				transport: {
					method: 'webhook',
					callback: 'https://eventsub.solrock.mmattdonk.com/eventsub',
					secret: env.API_SECRET,
				},
			}),
			headers: {
				'Client-Id': env.CLIENT_ID ?? '',
				Authorization: 'Bearer ' + env.TWITCH_ACCESS_TOKEN,
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}),
	]);

	if (
		subscribeCheers.status === 401 ||
		subscribeResub.status === 401 ||
		subscribeCheers.status === 403 ||
		subscribeResub.status === 403 ||
		subscribeCheers.status === 429 ||
		subscribeResub.status === 429 ||
		subscribeCheers.status === 400 ||
		subscribeResub.status === 400 ||
		subscribeReward.status === 401 ||
		subscribeReward.status === 403 ||
		subscribeReward.status === 429 ||
		subscribeReward.status === 400
	)
		return res.status(500).send('Error subscribing to eventsub');
	else {
		return res.status(200).send('OK, in theory.');
	}
});

const start = async () => {
	try {
		await app.listen({ port: PORT, host: '0.0.0.0' });
		console.log(`@solrock/backend listening on port ${PORT}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};
start();

function getSecret() {
	// ahh!! leaked!! 😱
	return env.EVENTSUB_SECRET ?? 'superdanksecretdotcom';
}

// Build the message used to get the HMAC.
function getHmacMessage(request: FastifyRequest) {
	// @ts-ignore
	return request.headers[TWITCH_MESSAGE_ID] + request.headers[TWITCH_MESSAGE_TIMESTAMP] + JSON.stringify(request.body);
}

// Get the HMAC.
function getHmac(secret: crypto.BinaryLike | crypto.KeyObject, message: crypto.BinaryLike) {
	return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

// Verify whether our hash matches the hash that Twitch passed in the header.
function verifyMessage(hmac: any, verifySignature: any) {
	return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}
