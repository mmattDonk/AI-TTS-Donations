import { useTranslations } from 'next-intl';

export default function BetaBanner() {
	const t = useTranslations('beta');
	return (
		<p>
			{t.rich('header', {
				discordLink: (children) => <a href="https://discord.gg/VUAjRrkZVJ">{children}</a>,
			})}
		</p>
	);
}
