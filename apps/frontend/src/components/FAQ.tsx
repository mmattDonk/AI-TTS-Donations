import { Accordion, Container, createStyles, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

const useStyles = createStyles((theme) => ({
	wrapper: {
		paddingTop: theme.spacing.xl * 2,
		paddingBottom: theme.spacing.xl * 2,
	},

	title: {
		marginBottom: theme.spacing.xl * 1.5,
	},

	item: {
		borderRadius: theme.radius.md,
		marginBottom: theme.spacing.lg,

		border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
	},
}));

export default function FaqSimple() {
	const { classes } = useStyles();
	const t = useTranslations('Landing.FAQ');
	return (
		<Container size="sm" className={classes.wrapper}>
			<Title align="center" className={classes.title}>
				{t('heading')}
			</Title>

			<Accordion variant="separated">
				<Accordion.Item className={classes.item} value="viewer-learn">
					<Accordion.Control>{t('q1')}</Accordion.Control>
					<Accordion.Panel>
						{t.rich('a1', {
							githubLink: (children) => <a href="https://github.com/mmattDonk/AI-TTS-Donations/wiki/How-to-use-it!-(viewer)">{children}</a>,
							shortLink: (children) => <a href="https://mmatt.link/UseTTS">{children}</a>,
						})}
					</Accordion.Panel>
				</Accordion.Item>

				<Accordion.Item className={classes.item} value="get-help">
					<Accordion.Control>{t('q2')}</Accordion.Control>
					<Accordion.Panel>
						{t.rich('a2', {
							discordLink: (children) => <a href="https://discord.gg/VUAjRrkZVJ">{children}</a>,
							emailLink: (children) => <a href="mailto:matt@mmatt.net">{children}</a>,
							discordUserLink: (children) => <a href="https://discord.com/users/308000668181069824">{children}</a>,
						})}
					</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
		</Container>
	);
}
