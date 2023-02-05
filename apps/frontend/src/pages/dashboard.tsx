// mmattDonk 2023
// https://mmattDonk.com

import {
	Avatar,
	Button,
	Center,
	Code,
	Collapse,
	Container,
	Group,
	Kbd,
	NumberInput,
	SimpleGrid,
	Space,
	Stack,
	Switch,
	Text,
	Textarea,
	TextInput,
	Tooltip,
} from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconCross } from '@tabler/icons-react';
import { GetStaticPropsContext } from 'next';
import { signIn, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Head from 'next/head';
import { useState } from 'react';
import { WindowMaximize } from 'tabler-icons-react';
import BetaBanner from '../components/BetaBanner';
import ChatisAd from '../components/chatisad';
import { Footer } from '../components/Footer';
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
			if (!data?.config[0]) return;
			setConfig({ ...data?.config[0] });
		},
	});

	const configMutation = trpc.streamer.updateStreamerConfig.useMutation();

	const [config, setConfig] = useState(
		// TODO: fix this, i don't like it
		streamerData?.config[0] ?? {
			id: streamerData?.id,
			channelPointsName: '',
			channelPointsEnabled: false,
			bitsEnabled: true,
			resubsEnabled: true,
			maxMsgLength: 500,
			minBitAmount: 0,
			minTipAmount: 0,
			minMonthsAmount: 0,
			blacklistedWords: [],
			blacklistedVoices: [],
			blacklistedUsers: [],
			blacklistedVoiceEffects: [],
			fallbackVoice: 'jerma985',
		}
	);

	const saveConfig = async () => {
		await configMutation.mutateAsync({
			streamerId: streamerData?.id ?? '',
			config: { ...config, channelPointsName: config.channelPointsName ?? '' },
		});

		showNotification({
			id: 'savingConfig',
			message: 'Saving config...',
			loading: configMutation.isLoading,
		});
		if (!configMutation.isLoading) {
			if (configMutation.isError) {
				updateNotification({
					id: 'savingConfig',
					color: 'red',
					message: 'Error saving config',
					loading: false,
					icon: <IconCross size={16} />,
				});
			} else {
				updateNotification({
					id: 'savingConfig',
					color: 'teal',
					message: 'Config saved!',
					loading: false,
					autoClose: 1500,
				});
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
				<Spring>
					<Container size="xl">
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
										<h3>Events</h3>
										<Stack>
											<SimpleGrid cols={2}>
												<Switch
													checked={config.channelPointsEnabled ?? false}
													onChange={async (event) => {
														setConfig({ ...config, channelPointsEnabled: event.target.checked });
														await saveConfig();
													}}
													label={t('channelPoints')}
													onBlur={async () => await saveConfig()}
												/>
												<Tooltip label={t('Dashboard.configuration.channelPointRewardNameTooltip')} position={'bottom'}>
													<TextInput
														value={config.channelPointsName ?? ''}
														onChange={(event) => {
															setConfig({ ...config, channelPointsName: event.target.value });
														}}
														label={t('Dashboard.configuration.channelPointRewardNameLabel')}
														onBlur={async () => await saveConfig()}
													/>
												</Tooltip>
											</SimpleGrid>
											<SimpleGrid cols={2}>
												<Switch
													checked={config.resubsEnabled ?? true}
													onChange={async (event) => {
														setConfig({ ...config, resubsEnabled: event.target.checked });
														await saveConfig();
													}}
													label={t('resubs')}
													onBlur={async () => await saveConfig()}
												/>
												<NumberInput
													label={t('Dashboard.configuration.minResubMonthsLabel')}
													defaultValue={config.minMonthsAmount ?? 0}
													value={config.minMonthsAmount ?? 0}
													min={0}
													onChange={(val) => {
														setConfig({ ...config, minMonthsAmount: val ?? 0 });
													}}
													onBlur={async () => await saveConfig()}
												/>
											</SimpleGrid>
											<SimpleGrid cols={2}>
												<Switch
													checked={config.bitsEnabled ?? true}
													onChange={async (event) => {
														setConfig({ ...config, bitsEnabled: event.target.checked });
														await saveConfig();
													}}
													label={t('bits')}
													onBlur={async () => await saveConfig()}
												/>
												<NumberInput
													label={t('Dashboard.configuration.minBitsAmountLabel')}
													defaultValue={config.minBitAmount ?? 0}
													value={config.minBitAmount ?? 0}
													min={0}
													onChange={(val) => {
														setConfig({ ...config, minBitAmount: val ?? 0 });
													}}
													onBlur={async () => await saveConfig()}
													width={100}
												/>
											</SimpleGrid>
										</Stack>
										<h3>{t('Dashboard.configuration.maxMinLimitsHeading')}</h3>
										<Stack>
											<NumberInput
												label={t('Dashboard.configuration.maxMessageLengthLabel')}
												defaultValue={config.maxMsgLength ?? 500}
												value={config.maxMsgLength ?? 500}
												min={1}
												onChange={(val) => {
													setConfig({ ...config, maxMsgLength: val ?? 500 });
												}}
												onBlur={async () => await saveConfig()}
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
											onBlur={async () => await saveConfig()}
										/>
										<Textarea
											value={config.blacklistedVoices.join('\n').toLowerCase()}
											label={t('Dashboard.configuration.blacklistVoicesLabel')}
											autosize
											onChange={(event) => {
												// @ts-ignore
												setConfig({ ...config, blacklistedVoices: event.target.value.split('\n') });
											}}
											onBlur={async () => await saveConfig()}
										/>
										<Textarea
											value={config.blacklistedUsers.join('\n').toLowerCase()}
											label={t('Dashboard.configuration.blacklistUsersLabel')}
											autosize
											onChange={(event) => {
												// @ts-ignore
												setConfig({ ...config, blacklistedUsers: event.target.value.split('\n') });
											}}
											onBlur={async () => await saveConfig()}
										/>
										<Textarea
											value={config.blacklistedVoiceEffects.join('\n').toLowerCase()}
											label={t('Dashboard.configuration.blacklistVoiceEffectsLabel')}
											autosize
											onChange={(event) => {
												// @ts-ignore
												setConfig({ ...config, blacklistedVoiceEffects: event.target.value.split('\n') });
											}}
											onBlur={async () => await saveConfig()}
										/>
										<h3>{t('Dashboard.configuration.fallbacksHeading')}</h3>
										<TextInput
											value={config.fallbackVoice ?? ''}
											onChange={(event) => {
												setConfig({ ...config, fallbackVoice: event.target.value ?? '' });
											}}
											label={t('Dashboard.configuration.fallbacksVoiceLabel')}
											onBlur={async () => await saveConfig()}
										/>
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
					</Container>
					{
						// eventually, make it so that is randomly shows a different ad each time
						<Center>
							<Stack>
								<ChatisAd />
								<Text mt={'-2.5rem'} size="xs" ta="center">
									{t('Dashboard.adDisclaimer')}
								</Text>
							</Stack>
						</Center>
					}
					<Footer />
				</Spring>
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
