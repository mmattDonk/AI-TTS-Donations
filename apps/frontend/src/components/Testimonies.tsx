import { Carousel } from '@mantine/carousel';
import { Avatar, createStyles, Group, Text } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { Star } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
	body: {
		paddingLeft: 54,
		paddingTop: theme.spacing.sm,
	},
}));

const testimonies: CommentSimpleProps[] = [
	{
		author: {
			name: 'Ravtek',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/bac61a8e-5929-4c3e-9d79-8f9449318d61-profile_image-70x70.png',
			followers: '6.6K',
		},
		body: 'AI TTS is a blessing and is the future for any and all livestream memes LOL',
		stars: 5,
	},
	{
		author: {
			name: 'K_A_L_Y',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/83c01131-e303-4a04-b2ec-7445facad5b1-profile_image-70x70.png',
			followers: '2.9K',
		},
		body: 'I had a lot of fun playing around with AI TTS thank you for making this plugin.',
		stars: 5,
	},
	{
		author: {
			name: 'LiptonGod',
			image: 'https://cdn.7tv.app/pp/60532eaab4d31e459f727bcd/4d77d7a5f1824289a3c67188046d02d3',
			followers: '923',
		},
		body: 'Ever since seeing AI TTS Donations, I immediately got hooked, You cannot go wrong with having a free AI TTS, most definitely recommend this to those who are not able to pay for stuff like this.',
		stars: 5,
	},
	{
		author: {
			name: 'C3AGLE',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/96af8b14-8b41-4948-af83-da7d925304df-profile_image-70x70.png',
			followers: '496',
		},
		body: 'This is a very good tts app and I love it very much',
		stars: 5,
	},
	{
		author: {
			name: 'Chrustosking',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/746031b3-bc32-4b67-b0a2-1e13b85cd324-profile_image-70x70.png',
			followers: '399',
		},
		body: 'Ive been using the AI TTS for over a week now with my stream, the potential it has is amazing. The amount of creativity (depending on twitch chat) is endless, although a few issues and having to restart a lot, its honestly worth it for the content it can provided. I will continue to use AI TTS and support this program as i believe its the future of TTS',
		stars: 4,
	},
	{
		author: {
			name: 'WhatTheWoda',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/662e281d-3883-4d27-86c3-2b24d48f6195-profile_image-70x70.png',
			followers: '234',
		},
		body: "Really fun to use and have people join in on the fun when streaming. It has its features, but for the price, you can't go wrong! Try it, you'll love it!",
		stars: 5,
	},
	{
		author: {
			name: 'AuroR6S',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/73cca255-1a58-40a8-8cb9-983aa9392372-profile_image-300x300.png',
			followers: '146',
		},
		body: 'I love this app! It breaks sometimes but its very good!',
		stars: 5,
	},
	{
		author: {
			name: 'TheNoob950',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/093be1fa-aa9b-4469-bcf2-96278e37c8e1-profile_image-70x70.png',
			followers: '112',
		},
		body: "Some of the funniest moments in my streams came from viewers blind-siding me with TTS. It's especially great for games where I need to focus and can't look at chat. 11/10, would use again.",
		stars: 4,
	},
	{
		author: {
			name: 'johnpaul4444',
			followers: '2',
			image: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-70x70.png',
		},
		body: "One of the best integrations of Uberduck.ai I've ever seen... Making it accessible and simple for all to enjoy!",
		stars: 5,
	},
];

interface CommentSimpleProps {
	body: string;
	stars: number;
	author: {
		name: string;
		image: string;
		followers: string;
	};
}

function Testimonial({ body, author, stars }: CommentSimpleProps) {
	const { classes } = useStyles();

	return (
		<div>
			<Group>
				<Avatar src={author.image} alt={author.name} radius="xl" />
				<div>
					<Text size="lg">
						<a href={`https://twitch.tv/${author.name}`}>{author.name}</a>
					</Text>
					<Text size="sm">{author.followers} followers</Text>
				</div>
				{[...Array(stars)].map((index) => (
					// this still gives a warning and idk why
					<Star key={index} color="gold" fill="gold" />
				))}
			</Group>
			<Text className={classes.body} size="lg">
				{body}
			</Text>
		</div>
	);
}

export default function TestimoniesComponent() {
	const autoplay = useRef(Autoplay({ delay: 10000 }));

	return (
		<Carousel
			style={{
				marginBottom: '1rem',
				maxWidth: 620,
			}}
			withIndicators
			loop
			withControls={false}
			height={300}
			plugins={[autoplay.current]}
			mx="auto"
			align="center"
		>
			{testimonies.map((t) => (
				<Carousel.Slide
					key={t.author.name}
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Testimonial key={t.author.name} {...t} />
				</Carousel.Slide>
			))}
		</Carousel>
	);
}
