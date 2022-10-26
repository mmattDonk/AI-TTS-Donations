import { Badge } from '@mantine/core';

export default function BetaBanner() {
	return (
		<Badge style={{ marginTop: '1rem' }} color="yellow" variant="outline">
			This is a BETA website. Please report bugs to the <a href="https://discord.gg/VUAjRrkZVJ">mmattDonk Discord server</a>.
			(only thing not working at the moment are blacklisted things and fallback voices, however that config will still save if you put stuff in there, so when those things do get working it will instantly apply with your config)
		</Badge>
	);
}
