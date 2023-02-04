// mmattDonk 2023
// https://mmattDonk.com

import { Avatar, Button, Center, Container, createStyles, Group, Menu, Text, Title, Tooltip, UnstyledButton } from '@mantine/core';
import type { GetStaticPropsContext, NextPage } from 'next';
import { signIn, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Head from 'next/head';
import Link from 'next/link';
import { useRef } from 'react';
import { Dashboard, DoorExit } from 'tabler-icons-react';
import BetaBanner from '../components/BetaBanner';
import Bubbles from '../components/Bubbles';
import Dots from '../components/Dots';
import FaqSimple from '../components/FAQ';
import Features from '../components/Features';
import { Footer } from '../components/Footer';
import { LoadingSpinner } from '../components/Loading';
import Spring from '../components/Spring';
import TestimoniesComponent from '../components/Testimonies';
import { trpc } from '../utils/trpc';

const useStyles = createStyles((theme) => ({
	wrapper: {
		position: 'relative',
		paddingTop: 120,
		paddingBottom: 80,

		'@media (max-width: 755px)': {
			paddingTop: 80,
			paddingBottom: 60,
		},
	},

	inner: {
		position: 'relative',
		zIndex: 1,
	},

	dots: {
		position: 'absolute',
		color: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],

		'@media (max-width: 755px)': {
			display: 'none',
		},
	},

	dotsLeft: {
		left: 0,
		top: 0,
	},

	title: {
		textAlign: 'center',
		fontWeight: 800,
		fontSize: 40,
		letterSpacing: -1,
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		marginBottom: theme.spacing.xs,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,

		'@media (max-width: 520px)': {
			fontSize: 28,
			textAlign: 'left',
		},
	},

	description: {
		textAlign: 'center',

		'@media (max-width: 520px)': {
			textAlign: 'left',
			fontSize: theme.fontSizes.md,
		},
	},

	controls: {
		marginTop: theme.spacing.lg,
		display: 'flex',
		justifyContent: 'center',

		'@media (max-width: 520px)': {
			flexDirection: 'column',
		},
	},

	control: {
		'&:not(:first-of-type)': {
			marginLeft: theme.spacing.md,
		},

		'@media (max-width: 520px)': {
			height: 42,
			fontSize: theme.fontSizes.md,

			'&:not(:first-of-type)': {
				marginTop: theme.spacing.md,
				marginLeft: 0,
			},
		},
	},
}));

const Home: NextPage = () => {
	const { data: session, isLoading } = trpc.auth.getSession.useQuery();
	const { classes } = useStyles();
	const t = useTranslations();

	const BRRef = useRef<HTMLBRElement>(null);
	const scrollToPositions = () => BRRef.current?.scrollIntoView({ behavior: 'smooth' });

	return (
		<>
			<Head>
				<title>AI TTS Donations</title>
				<meta name="description" content="The first 100% free AI TTS service for Twitch" />
				<meta
					name="keywords"
					content="ai tts, twitch, free ai tts, twitch ai tts, ai tts donations, how to setup tts on twitch, all twitch tts voices, twitch text to speech fax machine, how to add tts to twitch, how to donate tts on twitch, tts donations, twitch female tts, twitch tts spam guide, tts twitch donations, how to enable tts twitch, twitch tts copypasta reddit, how to make twitch tts pause, twitch tts for channel points, funny tts twitch donations, how to use tts on twitch mobile, twitch tts, twitch tts best, how to donate text to speech twitch, twitch tts tricks, how to break text to speech twitch, twitch tts reader, how to text to speech in twitch, how to get tts on twitch chat, how to enable tts on twitch, twitch tts different voices, twitch tts discord bot, tts bot twitch, twitch text to speech german, how to break twitch tts, twitch tts channel points, twitch tts my sprinkler goes, how to tts on twitch, twitch tts copypasta printer, twitch tts high pitch, twitch tts helicopter, how to tts in twitch, text-to-speech donations enabled, twitch tts for bits, how to tts twitch, twitch alerts text to speech, text to speech donations streamelements, twitch tts commands, how to text to speech twitch chat, funny tts twitch messages, ai tts twitch, how to use text to speech in twitch, how to mute tts twitch, how to use tts in twitch, ai tts, best tts donations reddit, xqc tts voice, how to turn tts on twitch, how to make twitch tts beatbox, how to send tts messages on twitch, ai twitter bot racist, ai twitch streamer, how to do text to speech twitch, how to text to speech twitch, how to change tts voice twitch, twitch tts chat, twitch text to speech app, funny tts twitch donations copy and paste, tts twitch voice, twitch tts sound effects, how to get tts on twitch channel points, how to send a tts on twitch, twitch tts download, twitch tts girl voice, twitch tts tester, twitch tts diaeresis, twitch tts funny, funny tts twitch, how to enable tts donations streamlabs, twitch tts bits, twitch tts tricks, twitch tts voice generator, how to add tts to twitch channel points, how to make twitch tts sing, tts twitch troll, text to speech twitch extension, how to send tts messages on twitch, ai tts voices, twitch tts dialysis, text to speech twitch italiano, how to turn off tts on twitch, twitch tts effects, twitch tts android, tts en twitch, how to donate tts on twitch mobile, how to do tts on twitch, twitch tts beatbox, twitch tts einrichten, how to skip tts twitch, twitch tts copypasta uu rr, how to activate tts on twitch, twitch tts messages, funny tts on twitch, text to speech bot twitch, twitch tts bomb, how to activate tts on twitch, ai tts characters, tts bot for twitch, funny tts donations twitch, tts in twitch, twitch tts troll messages, how to make twitch tts talk fast, twitch tts ideas, how to make twitch tts talk fast, twitch tts generator, how to use tts twitch, tts twitch español, how to send text to speech twitch"
				/>
				<meta name="author" content="mmattDonk // mmattbtw" />

				{/* Open Grpah Tags */}
				<meta property="og:title" content="AI TTS Donations" />
				<meta property="og:description" content="The first 100% free AI TTS service for Twitch" />
				{/* TODO: move this url to the real URL when that eventually happens :-) */}
				<meta property="og:url" content="https://solrock.mmattDonk.com/" />
				<meta property="og:type" content="website" />

				{/* Twitter Card Tags */}
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="AI TTS Donations" />
				<meta name="twitter:description" content="The first 100% free AI TTS service for Twitch" />
				<meta name="twitter:site" content="@mmattDonk" />
				<meta name="twitter:creator" content="@mmattDonk" />
			</Head>
			<Center>
				<BetaBanner />
			</Center>
			<Spring>
				<Container>
					<Group mb={'1rem'} mt={'1rem'} position="right">
						{/* <TranslationMenu /> */}
						{isLoading ? (
							<LoadingSpinner />
						) : session ? (
							<>
								<Menu>
									<Menu.Target>
										<UnstyledButton>
											<Avatar radius="xl" src={session.user?.image} alt={t('alt.avatar', { name: session.user?.name })} />
										</UnstyledButton>
									</Menu.Target>
									<Menu.Dropdown>
										<Menu.Label>{t('loggedIn', { name: session.user?.name })}</Menu.Label>
										<Menu.Item icon={<Dashboard size={18} />} component={Link} href="/dashboard">
											{t('Landing.dashboard')}
										</Menu.Item>
										<Menu.Item icon={<DoorExit size={18} />} color="red" onClick={() => signOut()}>
											{t('signOut')}
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							</>
						) : (
							<Button onClick={() => signIn('twitch')}>{t('signIn')}</Button>
						)}
					</Group>

					<Container className={classes.wrapper} size={1400}>
						<Dots className={classes.dots} style={{ left: 0, top: 0 }} />
						<Dots className={classes.dots} style={{ left: 60, top: 0 }} />
						<Dots className={classes.dots} style={{ left: 0, top: 140 }} />
						<Dots className={classes.dots} style={{ right: 0, top: 60 }} />

						<div className={classes.inner}>
							<Title className={classes.title}>
								{t.rich('Landing.heading', {
									gradientText: (children) => (
										<Text component="span" variant="gradient" gradient={{ from: 'blue', to: '#fa99ff' }} inherit>
											{children}
										</Text>
									),
									twitchText: (children) => (
										<Text component="span" color="#9146FF" inherit>
											{children}
										</Text>
									),
								})}
							</Title>

							<Container p={0} size={600}>
								<Text size="lg" color="dimmed" className={classes.description}>
									{t('Landing.description')}
								</Text>
							</Container>

							<div className={classes.controls}>
								<Group>
									{session && !isLoading ? (
										<>
											<Link href="/dashboard" prefetch>
												<Button className={classes.control} size="lg" disabled={isLoading}>
													{t('Landing.dashboard')}
												</Button>
											</Link>
										</>
									) : (
										<>
											<Button className={classes.control} size="lg" disabled={isLoading} onClick={() => signIn('twitch')}>
												{t('Landing.getStarted')}
											</Button>
										</>
									)}
									<Button variant="outline" className={classes.control} size="lg" onClick={scrollToPositions}>
										{t('learnMore')}
									</Button>
								</Group>
							</div>
						</div>
					</Container>

					<h2 style={{ textAlign: 'center' }}>{t('Landing.howItWorks')}</h2>

					<Center>
						<div
							style={{
								boxShadow: '0px 0px 10px rgba(0, 0, 0, 1)',
								padding: '5px',
								borderRadius: '5px',
							}}
						>
							<Tooltip label="Voice Tag">
								<Text color="yellow" component="span" inherit>
									spongebob
								</Text>
							</Tooltip>
							:{' '}
							<Tooltip label="Message">
								<Text color="cyan" component="span" inherit>
									Hey!
								</Text>
							</Tooltip>{' '}
							<Tooltip label="Seperator Character">
								<Text color="green" component="span" inherit>
									||
								</Text>
							</Tooltip>{' '}
							<Tooltip label="Voice Tag">
								<Text color="yellow" component="span" inherit>
									drake
								</Text>
							</Tooltip>
							:{' '}
							<Tooltip label="Message">
								<Text color="cyan" component="span" inherit>
									Hi Spongebob!
								</Text>
							</Tooltip>{' '}
							<Tooltip label="Seperator Character">
								<Text color="green" component="span" inherit>
									||
								</Text>
							</Tooltip>{' '}
							<Tooltip label="Playsound">
								<Text color="violet" component="span" inherit>
									(
									<Text color="red" component="span" inherit>
										1
									</Text>
									)
								</Text>
							</Tooltip>{' '}
							<Tooltip label="Seperator Character">
								<Text color="green" component="span" inherit>
									||
								</Text>
							</Tooltip>{' '}
							<Tooltip label="Voice Tag">
								<Text color="yellow" component="span" inherit>
									spongebob
								</Text>
							</Tooltip>
							:{' '}
							<Tooltip label="Message">
								<Text color="cyan" component="span" inherit>
									OMG So True
								</Text>
							</Tooltip>
						</div>
					</Center>

					<br ref={BRRef} />

					<h1>
						{t.rich('Landing.featuresHeading', {
							gradientText: (children) => (
								<Text
									component="span"
									variant="gradient"
									gradient={{
										from: 'red',
										to: '#b50000',
									}}
									inherit
								>
									{children}
								</Text>
							),
						})}
					</h1>

					<Features />
					<br />

					<h1 style={{ textAlign: 'center' }}>{t('Landing.dontBelieve')}</h1>
					<h3 style={{ textAlign: 'center', marginTop: '-1.5rem' }}>{t('Landing.dontBelieveDesc')}</h3>
					<TestimoniesComponent />
					<p style={{ textAlign: 'center' }}>
						{t.rich('Landing.testimonyCTA', {
							link: (children) => <a href="https://mmatt.link/TTSTestimonies">{children}</a>,
						})}
					</p>

					<FaqSimple />
					<Bubbles />
				</Container>
				<div
					style={{
						// background color gradient from comepletely transparent to black
						background: `linear-gradient(
									to bottom,
									rgba(0, 0, 0, 0),
									rgba(0, 0, 0, 1)
								)`,
						paddingTop: '1rem',
						paddingBottom: '2rem',
						width: '100%',
						height: '20rem',
					}}
				>
					<div
						style={{
							// center vertically
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							height: '100%',
						}}
					>
						<h1 style={{ textAlign: 'center' }}>{t('Landing.getStartedToday')}</h1>
						<p>{t('Landing.getStartedDesc')}</p>
						<Link href="/dashboard" prefetch>
							<Center>
								<Button>{t('Landing.getStarted')}</Button>
							</Center>
						</Link>
					</div>
				</div>
				<Footer />
			</Spring>
		</>
	);
};

export default Home;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
	return {
		props: {
			messages: (await import(`../../i18n/${locale}.json`)).default,
		},
	};
}
