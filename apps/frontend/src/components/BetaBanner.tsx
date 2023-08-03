// mmattDonk 2023
// https://mmattDonk.com

import { Badge, Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function BetaBanner() {
	const t = useTranslations();
	return (
		<Stack>
			<Badge style={{ marginTop: '1rem' }} color="yellow" variant="outline">
				{t.rich('beta.header', {
					discordLink: (children) => <a href="https://discord.gg/VUAjRrkZVJ">{children}</a>,
				})}
			</Badge>
			<Badge color="red">
				{t.rich('shutdown', {
					discordLink: (children) => <a href="https://discord.gg/VUAjRrkZVJ">{children}</a>,
				})}
			</Badge>
		</Stack>
	);
}
