import Image from 'next/image';

export function LoadingComponent() {
	return (
		<div>
			<p>Loading...</p>
			<Image src="/images/dankCircle.webp" alt={'pajaDank emote spinning in a circle, acting as a loading spinner.'} height="50" width="50" />
		</div>
	);
}
export function LoadingSpinner() {
	return <Image src="/images/dankCircle.webp" alt={'pajaDank emote spinning in a circle, acting as a loading spinner.'} height="50" width="50" />;
}

export default function LoadingPage() {
	return (
		<div
			style={{
				// center vertically
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100vh',
			}}
		>
			<div>
				<h1>Loading...</h1>
				<Image src="/images/dankCircle.webp" alt={'pajaDank emote spinning in a circle, acting as a loading spinner.'} height="100" width="100" />
			</div>
		</div>
	);
}
