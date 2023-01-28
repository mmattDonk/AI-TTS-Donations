import Image from 'next/image';

export default function ChatisAd() {
	return (
		<a href="https://chatis.lol" target="_blank" rel="noreferrer">
			<Image src="/images/chatisad.png" width={2224 / 2.5} height={592 / 2.5} alt="Chatis.lol ad" />
		</a>
	);
}
