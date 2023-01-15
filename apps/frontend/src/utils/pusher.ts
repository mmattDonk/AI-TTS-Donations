import Pusher from 'pusher';
import { env } from './env';

export const pusher = new Pusher({
	appId: env.PUSHER_APP_ID,
	cluster: env.PUSHER_APP_CLUSTER,
	key: env.PUSHER_APP_KEY,
	secret: env.PUSHER_APP_SECRET,
});
