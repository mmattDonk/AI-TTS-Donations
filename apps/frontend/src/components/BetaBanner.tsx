import { Badge } from '@mantine/core';

export default function BetaBanner() {
	return (
		<Badge style={{ marginTop: '1rem' }} color="yellow" variant="outline">
			This is a BETA website. Please report bugs to the <a href="https://discord.gg/VUAjRrkZVJ">mmattDonk Discord server</a>.
		</Badge>
	);
}
