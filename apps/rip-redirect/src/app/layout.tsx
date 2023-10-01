import './globals.css';

export const metadata = {
	title: 'Solrock has shutdown.',
	description: 'Checkout TTS.monster.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
