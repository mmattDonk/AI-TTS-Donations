import Image from 'next/image';

export default function OuraBotAd() {
	return (
		<div
			id="ourabotad"
			style={{
				// on hover make it so that the ad is slightly bigger
				transform: 'scale(1)',
				transition: 'transform 0.2s',
			}}
			onMouseEnter={() => {
				// adjust the scale of the ad
				// @ts-ignore
				document.querySelector('#ourabotad').style.transform = 'scale(1.05)';
			}}
			onMouseLeave={() => {
				// adjust the scale of the ad
				// @ts-ignore
				document.querySelector('#ourabotad').style.transform = 'scale(1)';
			}}
		>
			<a href="https://ourabot.com/?ref=solrock?" target="_blank" rel="noreferrer">
				<Image src="/images/ourabotad.png" width={2282 / 2.5} height={611 / 2.5} alt="OuraBot.com ad" />
			</a>
		</div>
	);
}
