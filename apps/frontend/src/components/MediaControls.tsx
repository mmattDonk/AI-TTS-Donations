// mmattDonk 2023
// https://mmattDonk.com

import { Button, Collapse, Container, Group, Space, Stack, Table } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Rotate } from 'tabler-icons-react';
import { trpc } from '../utils/trpc';
import { LoadingSpinner } from './Loading';

export default function MediaControls() {
	const ttsMutation = trpc.tts.retriggerTts.useMutation();

	const [showTable, setShowTable] = useState(false);

	const { data: userData, isLoading } = trpc.user.getUser.useQuery();
	const { data: ttsMessages, isLoading: isTtsMessagesLoading } = trpc.tts.getRecentMessages.useQuery({
		streamerId: userData?.streamers[0]?.id ?? '',
	});

	const [skipMessage, setSkipMessage] = useState('');

	const skipMutation = trpc.tts.skipTts.useMutation();
	const t = useTranslations();

	const skipTts = async (e: any) => {
		e.preventDefault();

		skipMutation.mutate({ overlayId: userData?.streamers[0]?.overlayId ?? '' });

		if (skipMutation.isLoading) {
			setSkipMessage(t('MediaControls.skippingTts'));
		} else {
			if (skipMutation.data?.success) {
				setSkipMessage('');
			} else {
				setSkipMessage(t('MediaControls.failedToSkip'));
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
			title: t('MediaControls.sendingTts'),
			message: '',
			loading: ttsMutation.isLoading,
		});
		if (ttsMutation.isError) {
			showNotification({
				title: t('MediaControls.errorSendingTts'),
				message: ttsMutation.error?.message ?? '',
				color: 'red',
			});
		}
	};

	if (!userData && !isLoading) {
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
					<h1>{t('notLoggedIn')}</h1>
					<Button onClick={() => signIn('twitch')} size="xl">
						{t('signIn')}
					</Button>
				</Stack>
			</Container>
		);
	} else if (userData) {
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
						{t('MediaControls.skipTts')}
					</Button>
					{skipMutation.isLoading && (
						<>
							<LoadingSpinner /> <p>{skipMessage}</p>
						</>
					)}
				</Group>
				<Space h="md" />
				<Button onClick={() => setShowTable((o) => !o)}>
					{showTable ? t('close') : t('open')} {t('MediaControls.recentTtsMessages')}
				</Button>
				<Space h="sm" />
				<Collapse in={showTable}>
					{ttsMessages?.messages?.length ?? 0 > 0 ? (
						<Table style={{ textAlign: 'center' }}>
							<thead>
								<th>{t('MediaControls.replay')}</th>
								<th>{t('MediaControls.message')}</th>
								<th>{t('MediaControls.createdAt')}</th>
							</thead>
							<tbody>
								{ttsMessages?.messages?.map((message: any, i: number) => (
									<tr key={i}>
										<td>
											<div>
												<Button value={message.audioUrl} color="gray" onClickCapture={replayTts}>
													<Rotate />
												</Button>
											</div>
										</td>
										<td>
											<p
												style={{
													maxWidth: '50rem',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{message.message}
											</p>
										</td>
										<td>
											<p>
												{new Date(message.createdAt).toLocaleDateString()} at {new Date(message.createdAt).toLocaleTimeString()}
											</p>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					) : (
						<p>{t('MediaControls.noRecentTtsMessages')}</p>
					)}
				</Collapse>
			</div>
		);
	} else {
		<LoadingSpinner />;
	}
}
