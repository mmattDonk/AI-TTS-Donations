import Pusher from 'pusher';
import { env } from './env';

export const pusher = new Pusher({
	appId: env.SOKETI_APP_ID,
	key: env.SOKETI_APP_KEY,
	secret: env.SOKETI_APP_SECRET,
	host: env.SOKETI_URL,
	useTLS: true,
	port: `${env.SOKETI_PORT}`,
});
