import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import { env } from './env';
import { cheerEvent, redemptionEvent, streamer, subscriptionEvent } from './typings';
const app = express();
dotenv.config();
// port
const port = env.PORT || 4200;

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

app.use(
	express.raw({
		// Need raw message body for signature verification
		type: 'application/json',
	})
);

async function processEvent(broadcasterId: string, message: string, streamerJson: streamer) {
	if (message.length > streamerJson.streamer.config[0].maxMsgLength) return;
	console.log('STREAMER JSON', streamerJson);

	if (streamerJson) {
		console.log('EVENT MESSAGE???', message);
		console.log('STRAEMER OVERLAY?', streamerJson.streamer.overlayId);
		const serverlessRequest = await axios.post(
			SERVERLESS_PROCESSOR_URL,
			{
				message: message,
				overlayId: streamerJson.streamer.overlayId,
			},
			{
				headers: { Authorization: 'Bearer ' + env.API_SECRET },
			}
		);
		console.log('SERVERLESS REQUEST', serverlessRequest.data);
	} else {
		throw new Error('Streamer not found');
		// console.error("Streamer not found");
		// return;
	}
}

async function subscriptionCallback(event: subscriptionEvent, streamerJson: streamer) {
	if (streamerJson.streamer.config[0].minMonthsAmount > event.duration_months) return;
	if (streamerJson.streamer.config[0].resubsEnabled === false) return;
	if (event.user_name.toLowerCase() in streamerJson.streamer.config[0].blacklistedUsers) return;

	console.log('USER SUB', event.user_login);

	await processEvent(event.broadcaster_user_id, event.message.text, streamerJson);
	console.log('subscriptionCallback', event);
}

async function cheerCallback(event: cheerEvent, streamerJson: streamer) {
	if (streamerJson.streamer.config[0].minBitAmount > event.bits) return;
	if (streamerJson.streamer.config[0].bitsEnabled === false) return;
	if (event.user_name.toLowerCase() in streamerJson.streamer.config[0].blacklistedUsers) return;

	console.log('USER CHEER', event.user_login);

	await processEvent(event.broadcaster_user_id, event.message, streamerJson);
	console.log('cheerCallback', event);
}

async function redemptionCallback(event: redemptionEvent, streamerJson: streamer) {
	if (streamerJson.streamer.config[0].channelPointsName !== event.reward.title) return;
	if (streamerJson.streamer.config[0].channelPointsEnabled === false) return;
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
		let notification = JSON.parse(req.body);

		if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
			console.log(`Event type: ${notification.subscription.type}`);
			const streamer = await axios.get(API_URL + '/api/streamers/streamerId/' + notification.event.broadcaster_user_id, {
				headers: { secret: env.API_SECRET ?? '' },
			});
			const streamerJson = streamer.data as streamer;
			if (notification.subscription.type === 'channel.subscription.message') {
				res.status(204).send('success!');
				await subscriptionCallback(notification.event, streamerJson);
			} else if (notification.subscription.type === 'channel.cheer') {
				res.status(204).send('success!');
				await cheerCallback(notification.event, streamerJson);
			} else if (notification.subscription.type === 'channel.channel_points_custom_reward_redemption.add') {
				res.status(204).send('success!');
				await redemptionCallback(notification.event, streamerJson);
			} else console.log(JSON.stringify(notification.event, null, 4));
		} else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
			res.status(200).send(notification.challenge);
		} else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
			res.status(204).send('success!');

			console.log(`${notification.subscription.type} notifications revoked!`);
			console.log(`reason: ${notification.subscription.status}`);
			console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
		} else {
			res.sendStatus(204);
			console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
		}
	} else {
		console.log('403'); // Signatures didn't match.
		res.sendStatus(403);
	}
});

app.post('/newuser', async (req, res) => {
	console.log('new user!');
	// if bearer token not equal to env.secret
	const secret = req.headers.authorization?.split(' ')[1];
	if (secret !== env.API_SECRET) {
		console.log('rejected :p');
		return res.status(403).send('Forbidden');
	}
	const data = JSON.parse(req.body);

	const [subscribeResub, subscribeCheers, subscribeReward] = await Promise.all([
		axios.post(
			'https://api.twitch.tv/helix/eventsub/subscriptions',
			{
				type: 'channel.subscription.message',
				version: '1',
				condition: { broadcaster_user_id: data.streamerId },
				transport: {
					method: 'webhook',
					callback: 'https://eventsub.solrock.mmattdonk.com/eventsub',
					secret: env.API_SECRET,
				},
			},
			{
				headers: {
					'Client-Id': env.CLIENT_ID ?? '',
					Authorization: 'Bearer ' + env.TWITCH_ACCESS_TOKEN,
				},
			}
		),
		axios.post(
			'https://api.twitch.tv/helix/eventsub/subscriptions',
			{
				type: 'channel.cheer',
				version: '1',
				condition: { broadcaster_user_id: data.streamerId },
				transport: {
					method: 'webhook',
					callback: 'https://eventsub.solrock.mmattdonk.com/eventsub',
					secret: env.API_SECRET,
				},
			},
			{
				headers: {
					'Client-Id': env.CLIENT_ID ?? '',
					Authorization: 'Bearer ' + env.TWITCH_ACCESS_TOKEN,
				},
			}
		),
		axios.post(
			'https://api.twitch.tv/helix/eventsub/subscriptions',
			{
				type: 'channel.channel_points_custom_reward_redemption.add',
				version: '1',
				condition: { broadcaster_user_id: data.streamerId },
				transport: {
					method: 'webhook',
					callback: 'https://eventsub.solrock.mmattdonk.com/eventsub',
					secret: env.API_SECRET,
				},
			},
			{
				headers: {
					'Client-Id': env.CLIENT_ID ?? '',
					Authorization: 'Bearer ' + env.TWITCH_ACCESS_TOKEN,
				},
			}
		),
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

app.listen(port, () => {
	console.log(`@solrock/backend started at port ${port} 🎉`);
});

function getSecret() {
	// TODO: Get secret from secure storage. This is the secret you pass
	// when you subscribed to the event.

	// ahh!! leaked!! 😱
	return env.EVENTSUB_SECRET ?? 'superdanksecretdotcom';
}

// Build the message used to get the HMAC.
function getHmacMessage(request: any) {
	return request.headers[TWITCH_MESSAGE_ID] + request.headers[TWITCH_MESSAGE_TIMESTAMP] + request.body;
}

// Get the HMAC.
function getHmac(secret: crypto.BinaryLike | crypto.KeyObject, message: crypto.BinaryLike) {
	return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

// Verify whether our hash matches the hash that Twitch passed in the header.
function verifyMessage(hmac: any, verifySignature: any) {
	return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}
