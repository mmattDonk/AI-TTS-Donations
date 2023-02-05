// mmattDonk 2023
// https://mmattDonk.com

import { Button, Menu, useMantineTheme } from '@mantine/core';
import { IconChevronDown, IconPackage } from '@tabler/icons-react';

const languages: { name: string; code: string }[] = [
	{
		name: 'English',
		code: 'en-US',
	},
	{
		name: 'Spanish',
		code: 'es-ES',
	},
	{
		name: 'French',
		code: 'fr-FR',
	},
	{
		name: 'German',
		code: 'de-DE',
	},
];

export function TranslationMenu() {
	const theme = useMantineTheme();
	return (
		<Menu transition="pop-top-right" position="top-end" width={220}>
			<Menu.Target>
				<Button variant="outline" rightIcon={<IconChevronDown size={18} stroke={1.5} />} pr={12}>
					Languages
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				{languages.map((language) => (
					<Menu.Item
						onClick={() => {
							window.location.href = `/${language.code}`;
						}}
						key={language.code}
						icon={<IconPackage size={16} color={theme.colors.blue[6]} stroke={1.5} />}
					>
						{language.name}
					</Menu.Item>
				))}
			</Menu.Dropdown>
		</Menu>
	);
}
