import { Badge, Stack } from '@mantine/core';

export default function BetaBanner() {
	return (
		<Stack>
			<Badge style={{ marginTop: '1rem' }} color="yellow" variant="outline">
				This is a BETA website. Please report bugs to the <a href="https://discord.gg/VUAjRrkZVJ">mmattDonk Discord server</a>.
			</Badge>
			<Badge color="red" variant="outline">
				Blacklisted (users, voices, and words) don't work, and fallback voices don't work.
			</Badge>
		</Stack>
	);
}
