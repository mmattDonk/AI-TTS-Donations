// mmattDonk 2023
// https://mmattDonk.com

import { Container, Group } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function LoadingComponent() {
	const t = useTranslations();
	return (
		<Group>
			<p>{t('loading')}</p>
			<Image src="/images/dankCircle.webp" alt={'pajaDank emote spinning in a circle, acting as a loading spinner.'} height="50" width="50" />
		</Group>
	);
}
export function LoadingSpinner() {
	return <Image src="/images/dankCircle.webp" alt={'pajaDank emote spinning in a circle, acting as a loading spinner.'} height="50" width="50" />;
}

export default function LoadingPage() {
	const t = useTranslations();
	return (
		<Container
			style={{
				// center vertically
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
			}}
		>
			<Group>
				<h1>{t('loading')}</h1>
				<Image src="/images/dankCircle.webp" alt={'pajaDank emote spinning in a circle, acting as a loading spinner.'} height="100" width="100" />
			</Group>
		</Container>
	);
}
