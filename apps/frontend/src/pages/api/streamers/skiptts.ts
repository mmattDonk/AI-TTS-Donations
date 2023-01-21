// mmattDonk 2023
// https://mmattDonk.com

import { NextApiRequest, NextApiResponse } from 'next';
import { env } from '../../../utils/env';
import { pusher } from '../../../utils/pusher';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (!req.headers.secret) {
		res.status(401).json({ message: 'Unauthorized' });
		return;
	} else if (!env.API_KEYS.split(',').includes(req.headers.secret as string)) {
		res.status(403).json({ message: 'Unauthorized' });
		return;
	}

	const { overlayId } = req.body;

	switch (req.method) {
		case 'POST':
			pusher.trigger(overlayId, 'skip-tts', {});

			res.status(200).json({ message: 'success' });
			return;
		default:
			res.status(405).json({ message: 'Method not allowed, use POST instead!' });
	}
}
