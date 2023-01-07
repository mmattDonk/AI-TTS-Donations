// mmattDonk 2023
// https://mmattDonk.com

import { GetStaticPropsContext } from 'next/types';
import BetaBanner from '../components/BetaBanner';
import MediaControls from '../components/MediaControls';

export default function MediaControlsPage() {
	return (
		<div
			style={{
				// center vertically and horizontally
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<BetaBanner />
			<MediaControls />
		</div>
	);
}

export async function getStaticProps({ locale }: GetStaticPropsContext) {
	return {
		props: {
			messages: (await import(`../../i18n/${locale}.json`)).default,
		},
	};
}
