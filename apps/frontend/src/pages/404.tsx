import { Container, createStyles, Group, Text, Title } from '@mantine/core';
import { GetStaticPropsContext } from 'next';
import { useTranslations } from 'next-intl';
import Head from 'next/head';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
	root: {
		paddingTop: 80,
		paddingBottom: 80,
	},

	label: {
		textAlign: 'center',
		fontWeight: 900,
		fontSize: 220,
		lineHeight: 1,
		marginBottom: theme.spacing.xl * 1.5,
		color:
			theme.colorScheme === 'dark'
				? // @ts-ignore
				  theme.colors.dark[4]
				: // @ts-ignore
				  theme.colors.gray[2],

		[theme.fn.smallerThan('sm')]: {
			fontSize: 120,
		},
	},

	title: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		textAlign: 'center',
		fontWeight: 900,
		fontSize: 38,

		[theme.fn.smallerThan('sm')]: {
			fontSize: 32,
		},
	},

	description: {
		maxWidth: 500,
		margin: 'auto',
		marginTop: theme.spacing.xl,
		marginBottom: theme.spacing.xl * 1.5,
	},
}));

export default function NotFoundPage() {
	const { classes } = useStyles();
	const t = useTranslations('404');

	return (
		<>
			<Head>
				<title>404 - AI TTS Donations</title>
				{/* Open Graph tags */}
				<meta property="og:title" content="404 - AI TTS Donations" />
				{/* Twitter Card Tags */}
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:site" content="@mmattbtw" />
				<meta name="twitter:creator" content="@mmattbtw" />
				<meta name="twitter:title" content="404 - AI TTS Donations" />
			</Head>
			<Container className={classes.root}>
				<div className={classes.label}>404</div>
				<Title className={classes.title}>{t('title')}</Title>
				<Text color="dimmed" size="lg" align="center" className={classes.description}>
					{t('description')}
				</Text>
				<Group position="center">
					<Link href="/" prefetch>
						{t('link')}
					</Link>
				</Group>
			</Container>
		</>
	);
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
	return {
		props: {
			messages: (await import(`../../i18n/${locale}.json`)).default,
		},
	};
}
