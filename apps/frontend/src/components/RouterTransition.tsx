// mmattDonk 2023
// https://mmattDonk.com

import { completeNavigationProgress, NavigationProgress, startNavigationProgress } from '@mantine/nprogress';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function RouterTransition() {
	const router = useRouter();

	useEffect(() => {
		const handleStart = (url: string) => url !== router.asPath && startNavigationProgress();
		const handleComplete = () => completeNavigationProgress();

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleComplete);
		router.events.on('routeChangeError', handleComplete);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleComplete);
			router.events.off('routeChangeError', handleComplete);
		};
	}, [router.asPath, router.events]);

	return <NavigationProgress autoReset={true} />;
}
