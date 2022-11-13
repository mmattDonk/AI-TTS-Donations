import { Button, Center, Stack } from '@mantine/core';
import { signIn } from 'next-auth/react';
import { FaTwitch } from 'react-icons/fa';

export default function SignInPage() {
	return (
		<Center>
			<Stack align="center">
				<h1>Sign In</h1>
				<Button color="grape" size="xl" onClick={() => signIn('twitch')}>
					<FaTwitch
						style={{
							marginRight: '0.5rem',
						}}
					/>{' '}
					Sign In With Twitch
				</Button>
			</Stack>
		</Center>
	);
}
