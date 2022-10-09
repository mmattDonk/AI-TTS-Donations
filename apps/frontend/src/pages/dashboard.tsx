import { Avatar, Button, Code, Collapse, Container, Group, Space, Stack, Switch, TextInput, Tooltip } from '@mantine/core';
import { GetStaticPropsContext } from 'next';
import { signIn, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Head from 'next/head';
import { useState } from 'react';
import { WindowMaximize } from 'tabler-icons-react';
import LoadingPage, { LoadingSpinner } from '../components/Loading';
import MediaControls from '../components/MediaControls';
import Spring from '../components/Spring';
import { trpc } from '../utils/trpc';

export default function Dashboard() {
	const [sensitiveOpen, setSensitiveOpen] = useState(false);
	const t = useTranslations();

	const { data: session, isLoading: isSessionLoading } = trpc.useQuery(['auth.getSession']);

	// TODO: these are returning undefined because session didn't finish loading yet, fix this?
	const { data: userData, isLoading } = trpc.useQuery(['user.get-user', session?.user?.name ?? '']);
	const { data: streamerData, isLoading: isStreamerLoading } = trpc.useQuery(['streamer.get-streamer', session?.user?.name ?? '']);

	console.log('user data???', userData);
	console.log(' streamer data/?!?!?', streamerData);

	const configMutation = trpc.useMutation('streamer.update-streamer-config');

	const [rewardName, setRewardName] = useState(streamerData?.config[0]?.channelPointsName ?? '');
	const [channelPointsEnabled, setChannelPointsEnabled] = useState(streamerData?.config[0]?.channelPointsEnabled ?? false);

	const [maxMsgLength, setMaxMsgLength] = useState(streamerData?.config[0]?.maxMsgLength ?? 0);
	const [minBitAmount, setMinBitAmount] = useState(streamerData?.config[0]?.minBitAmount ?? 0);
	const [minTipAmount, setMinTipAmount] = useState(streamerData?.config[0]?.minTipAmount ?? 0);

	const [blacklistedWords, setBlacklistedWords] = useState(streamerData?.config[0]?.blacklistedWords ?? []);
	const [blacklistedVoices, setBlacklistedVoices] = useState(streamerData?.config[0]?.blacklistedVoices ?? []);
	const [blacklistedUsers, setBlacklistedUsers] = useState(streamerData?.config[0]?.blacklistedUsers ?? []);

	const [fallbackVoice, setFallbackVoice] = useState(streamerData?.config[0]?.fallbackVoice ?? '');

	const [message, setMessage] = useState('');

	const saveConfig = async (e: any) => {
		e.preventDefault();

		configMutation.mutate({
			streamerId: userData?.accounts[0]?.providerAccountId ?? '',
			config: {
				channelPointsName: rewardName,
				channelPointsEnabled: channelPointsEnabled,
				maxMsgLength: maxMsgLength,
				minBitAmount: minBitAmount,
				minTipAmount: minTipAmount,
				blacklistedWords: blacklistedWords,
				blacklistedVoices: blacklistedVoices,
				blacklistedUsers: blacklistedUsers,
				fallbackVoice: fallbackVoice,
			},
		});

		if (!configMutation.isLoading) {
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
						<h1>You are not logged in.</h1>
						<Button onClick={() => signIn()} size="xl">
							Sign In
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
						{isLoading ? (
							<LoadingSpinner />
						) : (
							<>
								{isStreamerLoading ? (
									<LoadingSpinner />
								) : (
									<>
										<h2>Configuration</h2>
										<h3>Channel Points</h3>
										<Group>
											<TextInput
												value={rewardName}
												onChange={(event) => {
													setRewardName(event.target.value);
												}}
												label="Channel Point Reward Name (Case Sensitive)"
											/>
											<Switch
												checked={channelPointsEnabled}
												onChange={(event) => {
													setChannelPointsEnabled(event.target.checked);
												}}
												label="Enabled"
											/>
										</Group>
										<Space h="md" />
										<Button
											onClick={(e: any) => {
												saveConfig(e);
											}}
											disabled={configMutation.isLoading}
										>
											Save
										</Button>
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
											<a href={`/overlay/${userData?.streamers[0]?.overlayId}`} target="_blank" rel="noreferrer">
												{t('Dashboard.ttsOverlay')}
											</a>
										</Tooltip>{' '}
										-{' '}
										{t.rich('Dashboard.ttsOverlayDescription', {
											// @ts-ignore
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
