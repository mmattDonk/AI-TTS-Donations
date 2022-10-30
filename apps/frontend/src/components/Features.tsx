import { Container, createStyles, SimpleGrid, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Adjustments, Coin, Globe, Truck, Volume } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
	feature: {
		position: 'relative',
		paddingTop: theme.spacing.xl,
		paddingLeft: theme.spacing.xl,
	},

	overlay: {
		position: 'absolute',
		height: 100,
		width: 160,
		top: 0,
		left: 0,
		backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
		zIndex: 1,
	},

	content: {
		position: 'relative',
		zIndex: 2,
	},

	icon: {
		color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
	},

	title: {
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
	},
}));

interface FeatureProps extends React.ComponentPropsWithoutRef<'div'> {
	icon: React.FC<React.ComponentProps<typeof Truck>>;
	title: string;
	description: string;
}

function Feature({ icon: Icon, title, description, className, ...others }: FeatureProps) {
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.feature, className)} {...others}>
			<div className={classes.overlay} />

			<div>
				<Icon size={38} className={classes.icon} />
				<Text weight={700} size="lg" mb="xs" mt={5} className={classes.title}>
					{title}
				</Text>
				<Text color="dimmed" size="sm">
					{description}
				</Text>
			</div>
		</div>
	);
}

export default function Features() {
	const t = useTranslations('Landing.features');

	const features = [
		{
			icon: Coin,
			title: t('freeTitle'),
			description: t('freeDesc'),
		},
		{
			icon: Globe,
			title: t('openSourceTitle'),
			description: t('openSourceDesc'),
		},
		{
			icon: Volume,
			title: t('voicesTitle'),
			description: t('voicesDesc'),
		},
		{
			icon: Adjustments,
			title: t('voiceEffectsTitle'),
			description: t('voiceEffectsDesc'),
		},
		{
			icon: Volume,
			title: t('soundEffectsTitle'),
			description: t('soundEffectsDesc'),
		},
	];

	const items = features.map((item) => <Feature {...item} key={item.title} />);

	return (
		<Container mt={30} mb={30} size="lg">
			<SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} spacing={50}>
				{items}
			</SimpleGrid>
		</Container>
	);
}
