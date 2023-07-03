// mmattDonk 2023
// https://mmattDonk.com

import { Redis } from '@upstash/redis';
import https from 'https';
import { NextApiRequest, NextApiResponse } from 'next';
import { env } from '../../../../utils/env';
import prismaClient from '../../../../utils/prisma';

const redis = new Redis({
	url: process.env.REDIS_URL ?? '',
	token: process.env.REDIS_TOKEN ?? '',
	agent: new https.Agent({
		keepAlive: true,
	}),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// if secret not in request headers, return unauthorized
	if (!req.headers.secret) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	} else if (req.headers.secret !== env.API_SECRET) {
		res.status(403).json({ message: 'Unauthorized' });
		return;
	}

	const { overlayId } = req.query;

	if (req.method === 'GET') {
		const redisCache = await redis.get(overlayId as string);

		if (redisCache) {
			res.status(200).json({
				message: 'streamer found!',
				streamer: redisCache,
			});
			return;
		}
	}

	console.debug(overlayId);
	const streamer = await prismaClient.streamer.findFirst({
		where: {
			overlayId: overlayId as string,
		},
		include: {
			ttsmessages: false,
			user: true,
			config: true,
		},
	});

	if (!streamer) {
		res.status(404).json({ message: 'Streamer not found' });
		return;
	}

	// filter out the email field from the user object
	streamer.user.email = null;
	if (req.method === 'GET') {
		await redis.set(overlayId as string, JSON.stringify(streamer), {
			ex: 60 * 5,
		});
	}
	switch (req.method) {
		case 'GET':
			console.debug(overlayId);

			console.debug(streamer);
			res.status(200).json({
				message: 'streamer found!',
				streamer: streamer,
			});
			return;
		case 'POST':
			// im using this specifically for adding a new tts message so yeah
			const { message, audioUrl } = req.body as {
				message: string;
				audioUrl: string;
			};
			console.debug(streamer?.id);
			const newMessage = await prismaClient.ttsMessages.create({
				data: {
					message: message,
					audioUrl: audioUrl,
					streamerId: streamer?.id ?? '',
				},
			});

			res.status(200).json({
				message: 'message added!',
				newMessage: newMessage,
			});
	}
}
