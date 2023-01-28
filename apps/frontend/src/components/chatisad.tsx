import Image from 'next/image';

export default function ChatisAd() {
	return (
		<a href="https://chatis.lol" target="_blank" rel="noreferrer">
			<Image src="/images/chatisad.png" width={1112 / 1.5} height={490 / 1.5} alt="Chatis.lol ad" />
		</a>
	);
}
