// mmattDonk 2023
// https://mmattDonk.com

import { Badge, Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function BetaBanner() {
	const t = useTranslations();
	return (
		<Stack>
			<Badge style={{ marginTop: '1rem' }} color="red">
				{t.rich('shutdown', {
					discordLink: (children) => <a href="https://matt.paste.lol/ripsolrock.md/markup">{children}</a>,
				})}
			</Badge>
			<Badge color="green">
				{t.rich('ttsmonster', {
					ttsmonsterLink: (children) => <a href="https://tts.monster/?from=solrock">{children}</a>,
				})}
			</Badge>
		</Stack>
	);
}
