import { Avatar, Button, Center, Code, Collapse, Container, Group, Kbd, NumberInput, Space, Stack, Switch, Textarea, TextInput, Tooltip } from '@mantine/core';
import { GetStaticPropsContext } from 'next';
import { signIn, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Head from 'next/head';
import { useState } from 'react';
import { WindowMaximize } from 'tabler-icons-react';
import BetaBanner from '../components/BetaBanner';
import LoadingPage, { LoadingSpinner } from '../components/Loading';
import MediaControls from '../components/MediaControls';
import Spring from '../components/Spring';
import { trpc } from '../utils/trpc';

export default function Dashboard() {
	const [sensitiveOpen, setSensitiveOpen] = useState(false);
	const t = useTranslations();

	const { data: session, isLoading: isSessionLoading } = trpc.auth.getSession.useQuery();

	const { data: streamerData, isLoading: isStreamerLoading } = trpc.streamer.getStreamer.useQuery(session?.user?.name ?? '', {
		onSuccess(data) {
			setConfig(
				data?.config[0] ?? {
					id: streamerData?.id,
					channelPointsName: '',
					channelPointsEnabled: false,
					bitsEnabled: true,
					resubsEnabled: true,
					maxMsgLength: 1000,
					minBitAmount: 0,
					minTipAmount: 0,
					minMonthsAmount: 0,
					blacklistedWords: [],
					blacklistedVoices: [],
					blacklistedUsers: [],
					fallbackVoice: 'jerma985',
				}
			);
		},
	});

	const configMutation = trpc.streamer.updateStreamerConfig.useMutation();

	const [config, setConfig] = useState(
		streamerData?.config[0] ?? {
			id: streamerData?.id,
			channelPointsName: '',
			channelPointsEnabled: false,
			bitsEnabled: true,
			resubsEnabled: true,
			maxMsgLength: 1000,
			minBitAmount: 0,
			minTipAmount: 0,
			minMonthsAmount: 0,
			blacklistedWords: [],
			blacklistedVoices: [],
			blacklistedUsers: [],
			fallbackVoice: 'jerma985',
		}
	);

	const [message, setMessage] = useState('');

	const saveConfig = async () => {
		configMutation.mutate({
			streamerId: streamerData?.id ?? '',
			config: {
				channelPointsName: config.channelPointsName ?? '',
				channelPointsEnabled: config.channelPointsEnabled ?? false,
				bitsEnabled: config.bitsEnabled ?? true,
				resubsEnabled: config.resubsEnabled ?? true,
				maxMsgLength: config.maxMsgLength ?? 1000,
				minBitAmount: config.minBitAmount ?? 0,
				minTipAmount: config.minTipAmount ?? 0,
				minMonthsAmount: config.minMonthsAmount ?? 0,
				blacklistedWords: config.blacklistedWords ?? [],
				blacklistedVoices: config.blacklistedVoices ?? [],
				blacklistedUsers: config.blacklistedUsers ?? [],
				fallbackVoice: config.fallbackVoice ?? 'jerma985',
			},
		});

		if (configMutation.isLoading) {
			setMessage('');
		} else if (!configMutation.isLoading) {
			if (configMutation.isError) {
				setMessage('Error saving config');
			} else {
				setMessage('Config saved');
			}
		}
	};

	if (isSessionLoading) return <LoadingPage />;

	if (!session && !isSessionLoading) {
		return (
			<>
				<Head>
					<title>Dashboard - AI TTS Donations</title>
					{/* Open Graph tags */}
					<meta property="og:title" content="Dashboard - AI TTS Donations" />
					<meta
						property="og:description"
						content="AI TTS Donations is a free and Open Source AI TTS service for Twitch (and other platforms). It's the first of its class, no subscription services, no additional add-ons, and no ads."
					/>
					{/* Twitter Card Tags */}
					<meta name="twitter:card" content="summary" />
					<meta name="twitter:site" content="@mmattbtw" />
					<meta name="twitter:creator" content="@mmattbtw" />
					<meta name="twitter:title" content="Dashboard - AI TTS Donations" />
					<meta
						name="twitter:description"
						content="AI TTS Donations is a free and Open Source AI TTS service for Twitch (and other platforms). It's the first of its class, no subscription services, no additional add-ons, and no ads."
					/>
				</Head>
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
			</>
		);
	} else if (session) {
		return (
			<>
				<Head>
					<title>AI TTS Donations</title>
					{/* Open Graph tags */}
					<meta property="og:title" content="Dashboard - AI TTS Donations" />
					<meta
						property="og:description"
						content="AI TTS Donations is a free and Open Source AI TTS service for Twitch (and other platforms). It's the first of its class, no subscription services, no additional add-ons, and no ads."
					/>
					{/* Twitter Card Tags */}
					<meta name="twitter:card" content="summary" />
					<meta name="twitter:site" content="@mmattbtw" />
					<meta name="twitter:creator" content="@mmattbtw" />
					<meta name="twitter:title" content="Dashboard - AI TTS Donations" />
					<meta
						name="twitter:description"
						content="AI TTS Donations is a free and Open Source AI TTS service for Twitch (and other platforms). It's the first of its class, no subscription services, no additional add-ons, and no ads."
					/>
				</Head>
				<Center>
					<BetaBanner />
				</Center>
				<Container size="xl">
					<Spring>
						<Stack mt="xl" mb="xl" spacing="xs">
							<Group>
								<Avatar src={session.user?.image} size="lg" />
								<h1>{t('Dashboard.yourDash')}</h1>
							</Group>
							<Group>
								<p>{t('loggedIn', { name: session.user?.name })}</p>
								<Button color="gray" size="xs" onClick={() => signOut()}>
									{t('signOut')}
								</Button>
							</Group>
						</Stack>
						<div
							style={{
								border: '1px solid white',
								padding: '1rem',
							}}
						>
							<WindowMaximize
								onClick={() => {
									window.open('/mediacontrols', '_blank', 'popup=true');
								}}
								// on hover, make icon blue and cursor pointer
								style={{
									color: 'white',
									cursor: 'pointer',
								}}
							/>
							<MediaControls />
						</div>
						{isStreamerLoading ? (
							<LoadingSpinner />
						) : (
							<>
								{isStreamerLoading ? (
									<LoadingSpinner />
								) : (
									<>
										<h2>{t('Dashboard.configuration.configurationHeading')}</h2>
										<h3>{t('Dashboard.configuration.channelPointsHeading')}</h3>
										<Group>
											<TextInput
												value={config.channelPointsName ?? ''}
												onChange={(event) => {
													setConfig({ ...config, channelPointsName: event.target.value });
												}}
												label={t('Dashboard.configuration.channelPointRewardNameLabel')}
												onBlur={() => saveConfig()}
											/>
										</Group>
										<h3>Events</h3>
										<Stack>
											<Switch
												checked={config.channelPointsEnabled ?? false}
												onChange={(event) => {
													setConfig({ ...config, channelPointsEnabled: event.target.checked });
													saveConfig();
												}}
												label={t('channelPoints')}
											/>
											<Switch
												checked={config.resubsEnabled ?? true}
												onChange={(event) => {
													setConfig({ ...config, resubsEnabled: event.target.checked });
													saveConfig();
												}}
												label={t('resubs')}
											/>
											<Switch
												checked={config.bitsEnabled ?? true}
												onChange={(event) => {
													setConfig({ ...config, bitsEnabled: event.target.checked });
													saveConfig();
												}}
												label={t('bits')}
											/>
										</Stack>
										<h3>{t('Dashboard.configuration.maxMinLimitsHeading')}</h3>
										<Stack>
											<NumberInput
												label={t('Dashboard.configuration.maxMessageLengthLabel')}
												defaultValue={config.maxMsgLength ?? 1000}
												value={config.maxMsgLength ?? 1000}
												min={1}
												onChange={(val) => {
													setConfig({ ...config, maxMsgLength: val ?? 1000 });
												}}
												onBlur={() => saveConfig()}
											/>
											<NumberInput
												label={t('Dashboard.configuration.minBitsAmountLabel')}
												defaultValue={config.minBitAmount ?? 0}
												value={config.minBitAmount ?? 0}
												min={0}
												onChange={(val) => {
													setConfig({ ...config, minBitAmount: val ?? 0 });
												}}
												onBlur={() => saveConfig()}
											/>
											<NumberInput
												label={t('Dashboard.configuration.minResubMonthsLabel')}
												defaultValue={config.minMonthsAmount ?? 0}
												value={config.minMonthsAmount ?? 0}
												min={0}
												onChange={(val) => {
													setConfig({ ...config, minMonthsAmount: val ?? 0 });
												}}
												onBlur={() => saveConfig()}
											/>
										</Stack>
										<h3>{t('Dashboard.configuration.blacklistHeading')}</h3>
										<p>
											{t.rich('Dashboard.configuration.blacklistDescription', {
												Kbd: (children) => <Kbd>{children}</Kbd>,
											})}
										</p>
										<Textarea
											value={config.blacklistedWords.join('\n')}
											label={t('Dashboard.configuration.blacklistWordsLabel')}
											autosize
											onChange={(event) => {
												// @ts-ignore
												setConfig({ ...config, blacklistedWords: event.target.value.split('\n') });
											}}
											onBlur={() => saveConfig()}
										/>
										<Textarea
											value={config.blacklistedVoices.join('\n').toLowerCase()}
											label={t('Dashboard.configuration.blacklistVoicesLabel')}
											autosize
											onChange={(event) => {
												// @ts-ignore
												setConfig({ ...config, blacklistedVoices: event.target.value.split('\n') });
											}}
											onBlur={() => saveConfig()}
										/>
										<Textarea
											value={config.blacklistedUsers.join('\n').toLowerCase()}
											label={t('Dashboard.configuration.blacklistUsersLabel')}
											autosize
											onChange={(event) => {
												// @ts-ignore
												setConfig({ ...config, blacklistedUsers: event.target.value.split('\n') });
											}}
											onBlur={() => saveConfig()}
										/>
										<h3>{t('Dashboard.configuration.fallbacksHeading')}</h3>
										<TextInput
											value={config.fallbackVoice ?? ''}
											onChange={(event) => {
												setConfig({ ...config, fallbackVoice: event.target.value ?? '' });
											}}
											label={t('Dashboard.configuration.fallbacksVoiceLabel')}
											onBlur={() => saveConfig()}
										/>
										<Space h="md" />
										{configMutation.isLoading && <LoadingSpinner />}
										<p>{configMutation.isLoading ? '' : message}</p>
									</>
								)}

								<Space h="xl" />

								<Button mb={'xl'} color="red" onClick={() => setSensitiveOpen((o) => !o)}>
									{sensitiveOpen ? t('close') : t('open')} {t('Dashboard.sensitiveInfo')}
								</Button>
								<Collapse in={sensitiveOpen}>
									<p>
										<Tooltip label={t('Dashboard.sensitiveInfoWarning')}>
											<a href={`/overlay/${streamerData?.overlayId}`} target="_blank" rel="noreferrer">
												{t('Dashboard.ttsOverlay')}
											</a>
										</Tooltip>{' '}
										-{' '}
										{t.rich('Dashboard.ttsOverlayDescription', {
											Code: (children) => <Code>{children}</Code>,
										})}
									</p>
								</Collapse>
							</>
						)}
					</Spring>
				</Container>
			</>
		);
	}

	return <LoadingPage />;
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
	return {
		props: {
			messages: (await import(`../../i18n/${locale}.json`)).default,
		},
	};
}
