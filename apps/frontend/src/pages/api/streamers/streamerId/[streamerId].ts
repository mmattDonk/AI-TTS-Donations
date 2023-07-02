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

	const { streamerId } = req.query;

	const redisCache = await redis.get(streamerId as string);

	if (redisCache) {
		res.status(200).json({
			message: 'streamer found!',
			streamer: redisCache,
		});
		return;
	}

	console.debug(streamerId);
	const streamer = await prismaClient.streamer.findFirst({
		where: {
			user: {
				accounts: {
					some: {
						providerAccountId: streamerId as string,
					},
				},
			},
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
	streamer.user.email = null;
	await redis.set(streamerId as string, JSON.stringify(streamer), {
		ex: 60 * 5,
	});

	// filter out the email field from the user object

	switch (req.method) {
		// "GET" / "POST" routing, only using GET for now.
		case 'GET':
			console.debug(streamerId);
			console.debug(streamer);
			res.status(200).json({
				message: 'streamer found!',
				streamer: streamer,
			});
			return;
	}
}
