import { ActionIcon, Container, createStyles, Group } from '@mantine/core';
import { IconBrandDiscord, IconBrandGithub, IconBrandMastodon, IconBrandPatreon, IconBrandTwitter, IconWorld } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const useStyles = createStyles((theme) => ({
	footer: {
		marginTop: '1rem',
		borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
	},

	inner: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: theme.spacing.xl,
		paddingBottom: theme.spacing.xl,

		[theme.fn.smallerThan('xs')]: {
			flexDirection: 'column',
		},
	},

	links: {
		[theme.fn.smallerThan('xs')]: {
			marginTop: theme.spacing.md,
		},
	},
}));

export function Footer() {
	const { classes } = useStyles();
	const t = useTranslations('Footer');

	return (
		<div className={classes.footer}>
			<Container className={classes.inner}>
				<Group>
					<Image src="/images/mmattDonk.webp" width={48} height={48} alt="mmattDonk logo" />
					<div>
						<p style={{ fontWeight: 'bolder' }}>mmattDonk</p>
						<p>{t('description')}</p>
					</div>
				</Group>
				<Group spacing={0} className={classes.links} position="right" noWrap>
					<a href="https://twitter.com/mmattDonk">
						<ActionIcon size="lg">
							<IconBrandTwitter size={18} stroke={1.5} />
						</ActionIcon>
					</a>
					<a href="https://discord.gg/mvVePs2Hs2">
						<ActionIcon size="lg">
							<IconBrandDiscord size={18} stroke={1.5} />
						</ActionIcon>
					</a>
					<a href="https://github.com/mmattDonk">
						<ActionIcon size="lg">
							<IconBrandGithub size={18} stroke={1.5} />
						</ActionIcon>
					</a>
					<a href="https://fosstodon.org/@donk">
						<ActionIcon size="lg">
							<IconBrandMastodon size={18} stroke={1.5} />
						</ActionIcon>
					</a>
					<a href="https://www.patreon.com/mmattDonk">
						<ActionIcon size="lg">
							<IconBrandPatreon size={18} stroke={1.5} />
						</ActionIcon>
					</a>
					<a href="https://mmattDonk.com">
						<ActionIcon size="lg">
							<IconWorld size={18} stroke={1.5} />
						</ActionIcon>
					</a>
				</Group>
			</Container>
			<Container className={classes.inner}>
				{t.rich('support', {
					patreonLink: (children) => (
						<span>
							<IconBrandPatreon size={18} stroke={1.5} /> <a href="https://www.patreon.com/mmattDonk">{children}</a>
						</span>
					),
					discordSubLink: (children) => (
						<span>
							<IconBrandDiscord size={18} stroke={1.5} /> <a href="https://discordapp.com/servers/mmattdonk-883929594179256350">{children}</a>
						</span>
					),
				})}
			</Container>
		</div>
	);
}
