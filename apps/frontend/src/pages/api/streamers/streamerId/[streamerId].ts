import { edgePrisma as prisma } from '@solrock/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
	runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest, res: NextResponse) {
	// if secret not in request headers, return unauthorized
	if (!req.headers.get('secret')) {
		return NextResponse.json({ error: 'Unauthorized', status: 403 }, { status: 403 });
	} else if (req.headers.get('secret') !== process.env.API_SECRET) {
		return NextResponse.json({ error: 'Unauthorized', status: 403 }, { status: 403 });
	}

	const streamerId = req.nextUrl.searchParams.get('streamerId');
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
			ttsmessages: true,
			user: true,
			config: true,
		},
	});

	if (!streamer) {
		return NextResponse.json({ error: 'Streamer not found', status: 404 }, { status: 404 });
	}

	switch (req.method) {
		// "GET" / "POST" routing, only using GET for now.
		case 'GET':
			console.debug(streamerId);
			console.debug(streamer);
			return NextResponse.json({ message: 'streamer found!', streamer: streamer, status: 200 }, { status: 200 });
	}
}
