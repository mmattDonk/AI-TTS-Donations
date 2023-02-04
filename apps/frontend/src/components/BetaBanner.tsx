// mmattDonk 2023
// https://mmattDonk.com

import { Badge, Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function BetaBanner() {
	const t = useTranslations('beta');
	return (
		<Stack>
			<Badge style={{ marginTop: '1rem' }} color="yellow" variant="outline">
				{t.rich('header', {
					discordLink: (children) => <a href="https://discord.gg/VUAjRrkZVJ">{children}</a>,
				})}
			</Badge>
			{/* TODO: remindme in like a week to remove this */}
			<Badge style={{ marginTop: '-0.5rem' }} color="red" variant="light">
				{t('weekDisclaimer')}
			</Badge>
		</Stack>
	);
}
