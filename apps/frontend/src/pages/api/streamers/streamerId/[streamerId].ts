import { prisma } from '@solrock/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// if secret not in request headers, return unauthorized
	if (!req.headers.secret) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	} else if (req.headers.secret !== process.env.API_SECRET) {
		res.status(403).json({ message: 'Unauthorized' });
		return;
	}

	const { streamerId } = req.query;
	console.debug(streamerId);
	const streamer = await prisma.streamer.findFirst({
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
