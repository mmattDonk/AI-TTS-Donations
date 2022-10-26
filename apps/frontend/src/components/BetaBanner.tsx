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
			<Badge color="red" variant="outline">
				{t('description')}
			</Badge>
		</Stack>
	);
}
