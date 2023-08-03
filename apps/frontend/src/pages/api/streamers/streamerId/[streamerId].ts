// mmattDonk 2023
// https://mmattDonk.com

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'redis';
import { env } from '../../../../utils/env';
import prismaClient from '../../../../utils/prisma';

const redis = createClient({
	url: process.env.REDIS_URL,
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
	await redis.connect();

	const redisCache = await redis.get(streamerId as string);

	if (redisCache) {
		res.status(200).json({
			message: 'streamer found!',
			streamer: JSON.parse(redisCache),
		});
		await redis.disconnect();
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
		EX: 60 * 5,
	});

	// filter out the email field from the user object
	await redis.disconnect();

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
