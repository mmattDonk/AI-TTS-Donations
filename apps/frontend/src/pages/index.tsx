import { Avatar, Button, Center, Container, createStyles, Group, Menu, Text, TextInput, Title, Tooltip, UnstyledButton } from '@mantine/core';
import { NextLink } from '@mantine/next';
import type { GetStaticPropsContext, NextPage } from 'next';
import { signIn, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Dashboard, DoorExit } from 'tabler-icons-react';
import Bubbles from '../components/Bubbles';
import Dots from '../components/Dots';
import FaqSimple from '../components/FAQ';
import Features from '../components/Features';
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
		color:
			theme.colorScheme === 'dark'
				? // @ts-ignore
				  theme.colors.dark[5]
				: // @ts-ignore
				  theme.colors.gray[1],

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
	const { data: session, isLoading } = trpc.useQuery(['auth.getSession']);
	const { classes } = useStyles();
	const t = useTranslations();

	const BRRef = useRef<HTMLBRElement>(null);
	const inputElement = useRef<HTMLInputElement>(null);
	const [message, setMessage] = useState('');

	const scrollToPositions = () => BRRef.current?.scrollIntoView({ behavior: 'smooth' });

	const formMutation = trpc.useMutation(['mailing-list.subscribe']);

	const subscribe = async (e: any) => {
		e.preventDefault();
		if (!inputElement.current?.value) return;

		formMutation.mutate({ email: inputElement.current.value });
		if (!formMutation.isLoading) {
			if (formMutation.data?.success === false) {
				setMessage(formMutation.data?.error);
				return;
			} else {
				setMessage(t('Landing.emailSubscribeSuccess'));
			}
		}
	};

	return (
		<>
			<Container>
				<Spring>
					<Group mb={'1rem'} mt={'1rem'} position="right">
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
										<Menu.Item icon={<Dashboard size={18} />} component={NextLink} href="/dashboard">
											{t('Landing.dashboard')}
										</Menu.Item>
										<Menu.Item icon={<DoorExit size={18} />} color="red" onClick={() => signOut()}>
											{t('signOut')}
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							</>
						) : (
							<Button onClick={() => signIn()} size="xs">
								{t('signIn')}
							</Button>
						)}
					</Group>

					<Container className={classes.wrapper} size={1400}>
						<Dots className={classes.dots} style={{ left: 0, top: 0 }} />
						<Dots className={classes.dots} style={{ left: 60, top: 0 }} />
						<Dots className={classes.dots} style={{ left: 0, top: 140 }} />
						<Dots className={classes.dots} style={{ right: 0, top: 60 }} />

						<div className={classes.inner}>
							<Title className={classes.title}>
								The first{' '}
								<Text
									component="span"
									variant="gradient"
									gradient={{
										from: 'blue',
										to: '#fa99ff',
									}}
									inherit
								>
									100% free
								</Text>{' '}
								AI TTS service for{' '}
								<Text component="span" color={'#9146FF'} inherit>
									Twitch
								</Text>
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
											<Button className={classes.control} size="lg" disabled={isLoading} onClick={() => signIn()}>
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
						Features that are{' '}
						<Text
							component="span"
							variant="gradient"
							gradient={{
								from: 'red',
								to: '#b50000',
							}}
							inherit
						>
							unrivaled
						</Text>{' '}
						compared to anything else available.
					</h1>

					<Features />
					<br />

					<h1 style={{ textAlign: 'center' }}>Don't believe us?</h1>
					<h2 style={{ textAlign: 'center', marginBottom: '-30px' }}>Just look at what streamers say about it.</h2>
					<TestimoniesComponent />
					<p style={{ textAlign: 'center' }}>
						Are you a streamer that uses AI TTS Donations? Give us a review <a href="https://mmatt.link/TTSTestimonies">here!</a>
					</p>

					<FaqSimple />
				</Spring>
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
					{/* <h1 style={{ textAlign: "center" }}>
            {t("Landing.getStartedToday")}
          </h1>
          <Link href="/dashboard" prefetch>
            <Center>
              <Button>{t("Landing.getStarted")}</Button>
            </Center>
          </Link> */}
					<h1 style={{ textAlign: 'center' }}>{t('Landing.emailSignUp')}</h1>
					<p style={{ textAlign: 'center' }}>{t('Landing.emailNotReadyDescription')}</p>

					<form onSubmit={subscribe}>
						<Group>
							<TextInput required placeholder="yo@youremail.com" ref={inputElement} type="email" id="email-input" />

							<Button type="submit" disabled={formMutation.isLoading}>
								{t('submit')}
							</Button>
							{formMutation.isLoading && <LoadingSpinner />}
							<div>{!formMutation.isLoading && message}</div>
						</Group>
					</form>
					<p>
						{t('Landing.emailPapertrail')} - <a href="https://www.mmatt.net/blog">{t('learnMore')}</a>
					</p>
				</div>
			</div>
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
