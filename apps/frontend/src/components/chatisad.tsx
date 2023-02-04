import Image from 'next/image';

export default function ChatisAd() {
	return (
		<div
			id="chatisad"
			style={{
				// on hover make it so that the ad is slightly bigger
				transform: 'scale(1)',
				transition: 'transform 0.2s',
			}}
			onMouseEnter={() => {
				// adjust the scale of the ad
				// @ts-ignore
				document.querySelector('#chatisad').style.transform = 'scale(1.05)';
			}}
			onMouseLeave={() => {
				// adjust the scale of the ad
				// @ts-ignore
				document.querySelector('#chatisad').style.transform = 'scale(1)';
			}}
		>
			<a href="https://chatis.lol" target="_blank" rel="noreferrer">
				<Image src="/images/chatisad.png" width={2224 / 2.5} height={592 / 2.5} alt="Chatis.lol ad" />
			</a>
		</div>
	);
}
