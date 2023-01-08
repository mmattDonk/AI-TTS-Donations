// mmattDonk 2023
// https://mmattDonk.com

import { Button, Container, Group, Stack } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useVirtualizer } from '@tanstack/react-virtual';
import { signIn } from 'next-auth/react';
import { useRef, useState } from 'react';
import { Refresh } from 'tabler-icons-react';
import { trpc } from '../utils/trpc';
import LoadingPage, { LoadingSpinner } from './Loading';

export default function MediaControls() {
	const parentRef = useRef<HTMLDivElement>(null);

	const ttsMutation = trpc.tts.retriggerTts.useMutation();
	const skipMutation = trpc.tts.skipTts.useMutation();

	const { data: session, isLoading: isSessionLoading } = trpc.auth.getSession.useQuery();
	const { data: userData, isLoading } = trpc.user.getUser.useQuery(session?.user?.name ?? '');
	const { data: ttsMessages, isLoading: isTtsMessagesLoading } = trpc.tts.getRecentMessages.useQuery({
		streamerId: userData?.streamers[0]?.id ?? '',
	});

	const [skipMessage, setSkipMessage] = useState('');

	const rowVirtualizer = useVirtualizer({
		count: ttsMessages?.messages?.length ?? 0,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 50,
	});

	const skipTts = async (e: any) => {
		e.preventDefault();

		skipMutation.mutate({ overlayId: userData?.streamers[0]?.overlayId ?? '' });

		if (skipMutation.isLoading) {
			setSkipMessage('Skipping TTS');
		} else {
			if (skipMutation.data?.success) {
				setSkipMessage('');
			} else {
				setSkipMessage('Failed to skip TTS');
			}
		}
	};

	const replayTts = async (e: any) => {
		e.preventDefault();

		ttsMutation.mutate({
			overlayId: userData?.streamers[0]?.overlayId ?? '',
			audioUrl: e.currentTarget.value,
		});
		console.debug(e.currentTarget.value);

		showNotification({
			title: 'Sending TTS',
			message: '',
			loading: ttsMutation.isLoading,
		});
		if (ttsMutation.isError) {
			showNotification({
				title: 'Error sending TTS',
				message: ttsMutation.error?.message ?? '',
				color: 'red',
			});
		}
	};

	if (isSessionLoading) return <LoadingPage />;

	if (!session && !isSessionLoading) {
		return (
			<Container
				style={{
					// center vertically
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100vh',
				}}
			>
				<Stack align="center">
					<h1>You are not logged in.</h1>
					<Button onClick={() => signIn('twitch')} size="xl">
						Sign In
					</Button>
				</Stack>
			</Container>
		);
	} else if (session) {
		return isTtsMessagesLoading ? (
			<LoadingSpinner />
		) : (
			<div
				style={{
					marginTop: '1rem',
				}}
			>
				<Group>
					<Button color="gray" onClick={skipTts}>
						Skip TTS
					</Button>
					{skipMutation.isLoading && (
						<>
							<LoadingSpinner /> <p>{skipMessage}</p>
						</>
					)}
				</Group>
				{ttsMessages?.messages?.length ?? 0 > 0 ? (
					<>
						<h3>Recent Messages</h3>
						<div
							ref={parentRef}
							style={{
								height: '400px',
								overflow: 'auto',
							}}
						>
							<div
								style={{
									height: `${rowVirtualizer.getTotalSize()}px`,
									width: '100%',
									position: 'relative',
								}}
							>
								{rowVirtualizer.getVirtualItems().map((virtualItem) => (
									<div
										key={virtualItem.key}
										data-index={virtualItem.index}
										style={{
											position: 'absolute',
											top: 0,
											left: 0,
											width: '100%',
											transform: `translateY(${virtualItem.start}px)`,
										}}
									>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												gap: '1rem',
												overflowWrap: 'break-word',
											}}
										>
											<p>{ttsMessages?.messages[virtualItem.index].message}</p>
											<Button>
												<Refresh />
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					</>
				) : (
					<p>No recent TTS messages</p>
				)}
			</div>
		);
	}
	return <LoadingPage />;
}
