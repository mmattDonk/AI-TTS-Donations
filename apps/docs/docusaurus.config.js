// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Solrock Docs',
	tagline: 'Documentation for the AI TTS Donations project.',
	url: 'https://docs.solrock.mmattDonk.com',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',

	// Even if you don't use internalization, you can use this field to set useful
	// metadata like html lang. For example, if your site is Chinese, you may want
	// to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					routeBasePath: '/',
					editUrl: 'https://github.com/mmattDonk/AI-TTS-Donations/blob/main/apps/docs/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			navbar: {
				title: 'Solrock Docs',
				logo: {
					alt: 'mmattDonk Logo',
					src: 'img/mmattDonk.webp',
					href: 'https://mmattDonk.com',
				},
				items: [
					{
						type: 'doc',
						docId: 'index',
						position: 'left',
						label: 'Docs',
					},
					{
						href: 'https://github.com/mmattDonk/AI-TTS-Donations',
						label: 'GitHub',
						position: 'right',
					},
				],
			},
			footer: {
				style: 'dark',
				links: [
					{
						title: 'Community',
						items: [
							{
								label: 'Twitter',
								href: 'https://twitter.com/mmattDonk',
							},
							{
								label: 'Discord',
								href: 'https://discord.gg/mvVePs2Hs2',
							},
							{
								label: 'Mastodon',
								href: 'https://fosstodon.org/@donk',
							},
						],
					},
					{
						title: 'More',
						items: [
							{
								label: 'GitHub',
								href: 'https://github.com/mmattDonk',
							},
							{
								label: 'Patreon',
								href: 'https://www.patreon.com/mmattDonk',
							},
							{
								label: 'Website',
								href: 'https://mmattdonk.com/',
							},
						],
					},
				],
				copyright: `mmattDonk ${new Date().getFullYear()}. Built with Docusaurus.`,
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
			},
		}),
};

module.exports = config;
