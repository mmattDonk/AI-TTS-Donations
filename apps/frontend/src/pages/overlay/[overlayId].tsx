// mmattDonk 2023
// https://mmattDonk.com

import { useRouter } from 'next/router';
import Pusher from 'pusher-js';
import { useEffect, useRef, useState } from 'react';
import { env } from '../../utils/env';

export async function getServerSideProps() {
	return {
		props: {
			SOKETI_APP_KEY: env.SOKETI_APP_KEY,
			SOKETI_URL: env.SOKETI_URL,
			SOKETI_PORT: env.SOKETI_PORT,
		}, // will be passed to the page component as props
	};
}

export default function Overlay({
	SOKETI_APP_KEY,
	SOKETI_URL,
	SOKETI_PORT,
}: {
	SOKETI_APP_KEY: typeof env.SOKETI_APP_KEY;
	SOKETI_URL: typeof env.SOKETI_URL;
	SOKETI_PORT: typeof env.SOKETI_PORT;
}) {
	const [audioFiles, setAudioFiles] = useState<Array<string>>([]);
	const [currentAudioFile, setCurrentAudioFile] = useState<string | null>(null);
	const audioRef = useRef<HTMLAudioElement>(null);

	const router = useRouter();
	const { overlayId } = router.query;

	useEffect(() => {
		const pusher = new Pusher(SOKETI_APP_KEY, {
			wsHost: SOKETI_URL,
			wsPort: SOKETI_PORT,
			forceTLS: true,
			disableStats: true,
			enabledTransports: ['ws', 'wss'],
		});
		const channel = pusher.subscribe(overlayId as string);
		channel.bind('new-file', (data: { file: string }) => {
			console.debug(data.file);
			setAudioFiles([data.file, ...audioFiles]);
			console.debug(audioFiles);
			console.debug(currentAudioFile);
			if (currentAudioFile === null) {
				setCurrentAudioFile(data.file);
				setAudioFiles(audioFiles.filter((file) => file !== data.file));
			} else {
				// if audioRef not playing, go to next file
				if (audioRef.current?.paused) {
					playNextAudioFile();
				}
			}
		});
		channel.bind('skip-tts', () => {
			playNextAudioFile();
		});
		channel.bind('connected', () => {
			console.log('Connected to channel');
		});
		return () => {
			pusher.unbind_all();
			pusher.unsubscribe(overlayId as string);
			pusher.disconnect();
		};
	});

	const playNextAudioFile = () => {
		console.debug('PLAY NEXT AUDIO FILE');
		if (audioFiles.length > 0) {
			console.debug(audioFiles);
			setCurrentAudioFile(audioFiles[0] ?? null);
			setAudioFiles(audioFiles.filter((file) => file !== audioFiles[0]));
		} else {
			setCurrentAudioFile(null);
		}
	};

	return (
		<div>
			<audio
				src={currentAudioFile ?? ''}
				ref={audioRef}
				onEnded={() => {
					playNextAudioFile();
				}}
				autoPlay
			/>
		</div>
	);
}
