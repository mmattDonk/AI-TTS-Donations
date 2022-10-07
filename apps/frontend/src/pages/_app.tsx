// src/pages/_app.tsx
import { Center, ColorScheme, ColorSchemeProvider, Global, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { withTRPC } from '@trpc/next';
import { SessionProvider } from 'next-auth/react';
import { NextIntlProvider } from 'next-intl';
import type { AppType } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import superjson from 'superjson';
import BetaBanner from '../components/BetaBanner';
import type { AppRouter } from '../server/router';

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
	useEffect(() => {
		console.log(
			'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@/*/(* ,@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&*///((///*,#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ,(/(((((((//*  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ((((((((((((//* #@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ /(((((((((((((/*(,,@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@,(/((((((((((((((//,*@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@/(/((((((((((((((((///.(@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#/(/(((((((((((((((((((//,#@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#////(((((((((((((((((((((//,(@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&.*//((((((((((((((((((((((((/(.%@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ *//(((((((((((((((((((((((((((//(,.@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@**(/(((((((((((((((((((((((((((((((/**/*..%@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#,//(((((((((((((((((((((((((((((((((((((////*./(@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(,//((((((((((((((((((((((((((((((((((((((((((/////,./@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@..//(((((((((((((((((((((((((((((((((((((((((((((((((////* .@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  ///((((((((((((((((((((((((((((((((((((((((((((((((((((((/(*@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@/.///((((((((((((((((((((((((((((((((((((((((((((((((((((/((((//,(@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%**/((((((((((((((((((((((######((##%%#/((((((((((((((((((((((##(((*,%@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@# ,(##########((((((/(((((((((((/*,,,,.,,,,...,*((((((((((((((((((((((/(.#\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@,.((/(((((((((((((((((((((((((((*       .,.         .  **,,,,.            ./,\n' +
				'@@@@@@@@@@@@@@@@@@@@# .//(((((((((((((((((((((((((((((((((/*.     *%@@@@@@&(         .        .,(*  \n' +
				'@@@@@@@@@@@@@@@@@@@% *(((((((((((((((((((((((((((((((((((((((((/#@@@@@&&@@@@@@%.          ,%@@@@@@%,\n' +
				'@@@@@@@@@@@@@@@@@@@./((((((((((((((((((((((((((((((((((((((((((((/(((((((####/((((*,..   /@@@@@/,&@@\n' +
				'@@@@@@@@@@@@@@@@@ ,(/((((((((((((((((((((((((((((/(((/((((((((((((((((((((((((((((((((((((%%#(*/*,*%\n' +
				'@@@@@@@@@@@@@@@, ///((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((//(*,@@@@@\n' +
				'@@@@@@@@@@@@@@*.(/((((((((((((((((((((((((((((((((((((((((((((((((//////////////////((((///.%@@@@@@@\n' +
				'@@@@@@@@@@@@@@(((((((((((((((((((((((((((((((((((((/////////////(%&&&@@@@@@@@@&%(//((////*/@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@#/((((((((((((((((((((((((((((((((((((((////////////////////******////////*&@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@(//(((((((((((((//((//(((((((((((((((((((((((((((((///////((((((((((((/(/.(@@@@@@@@@@@\n' +
				'@@@@@@@@@& ,//#//(((///((((((((((((((((((((///((///(((/(((((((((((((((((///(((((((//(..@@@@@@@@@@@@@\n' +
				'@@@@@@*.#(//(((((((/(########((((((((((((((((((((%%%%#/((((((((((((//(((((/(((((####*..@@@@@@@@@@@@@\n' +
				'@@&,,((//(((((((((((((((((((((((((((((((((((((((((((((((((((#####(((((((((((((((((((//(*.#@@@@@@@@@@\n' +
				'@&.///(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((//,*&@@@@@@@@\n' +
				'@@///((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((/,#@@@@@@@@\n' +
				'@&/((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((/,#@@@@@@@@\n' +
				'@*(/(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((/,#@@@@@@@@\n' +
				'@*(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((/,#@@@@@@@@\n' +
				'@/(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((/*/@@@@@@@@\n' +
				'.((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((//.%@@@@@@@\n' +
				'(*/(/((((((((((((((((((((/********/(((((/((((((((((//((((((((((//((((((((((/(((/((((((/(((/.%@@@@@@@\n' +
				'\n\n>>>>>>>>>>>>>>>>>>>>>>>>>> open source software for allllllll: https://mmattDonk.com <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
		);
	}, []);

	const router = useRouter();

	if (router.pathname.split('/')[1] !== 'overlay') {
		return (
			<MantineTheme>
				<SessionProvider session={session}>
					<NextIntlProvider messages={pageProps.messages}>
						<Center>
							<BetaBanner />
						</Center>
						<Component {...pageProps} />
					</NextIntlProvider>
				</SessionProvider>
			</MantineTheme>
		);
	} else {
		return (
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		);
	}
};

export const getBaseUrl = () => {
	if (typeof window !== 'undefined') {
		return '';
	}
	if (process.browser) return ''; // Browser should use current path
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			url,
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp);

function MantineTheme({ children }: { children: React.ReactNode }) {
	const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
	const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	return (
		<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
			<MantineProvider theme={{ colorScheme }} withNormalizeCSS withGlobalStyles>
				<NotificationsProvider>
					<Global
						styles={(theme) => ({
							a: {
								color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.colors.gray![7],
								textDecoration: 'underline',

								'&:hover': {
									backgroundColor:
										theme.colorScheme === 'dark'
											? //@ts-ignore
											  theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
											: //@ts-ignore
											  theme.colors[theme.primaryColor][0],
									color: theme.colors[theme.primaryColor]![theme.colorScheme === 'dark' ? 3 : 7],
									textDecoration: 'none',
								},
							},
						})}
					/>
					{children}
				</NotificationsProvider>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
