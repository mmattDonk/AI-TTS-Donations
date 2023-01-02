import { Carousel } from '@mantine/carousel';
import { Avatar, createStyles, Group, Rating, Text } from '@mantine/core';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useState } from 'react';

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
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/bac61a8e-5929-4c3e-9d79-8f9449318d61-profile_image-300x300.png',
			followers: '6.6K',
		},
		body: 'AI TTS is a blessing and is the future for any and all livestream memes LOL',
		stars: 5,
	},
	{
		author: {
			name: 'K_A_L_Y',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/83c01131-e303-4a04-b2ec-7445facad5b1-profile_image-300x300.png',
			followers: '2.9K',
		},
		body: 'I had a lot of fun playing around with AI TTS thank you for making this plugin.',
		stars: 5,
	},
	{
		author: {
			name: 'Shibez__',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/a3d5c9e2-d658-47d7-ac3f-651e85fb8b27-profile_image-300x300.png',
			followers: '1.4K',
		},
		body: "THIS SITE IS AMAZING!! Been using mmatt's old version that needed download and configuration but this one is so much easier to use! Finally I dont have to seperatly open a new application to use the TTS.",
		stars: 5,
	},
	{
		author: {
			name: 'judo_kami',
			followers: '1.2K',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/6628a6da-a430-4f9a-8124-7b9374c25764-profile_image-300x300.png',
		},
		body: 'Overall this is a very amazing bot that can lead to some very funny situations on stream. Do you want Winnie the pooh and Optimus Prime to have a convo? well, now you can!',
		stars: 5,
	},
	{
		author: {
			name: 'NaMTheWeebs',
			image: 'https://cdn.7tv.app/pp/60aebfce6cfcffe15f119c18/10a9a36043e04cc0ba7409ea064a9ab6',
			followers: '979',
		},
		body: 'No more Brian TTS everywhere, this is the next thing, this thing right here will change the game entirely.',
		stars: 5,
	},
	{
		author: {
			name: 'matrHS',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/af99edb7-aa24-4873-9070-3627f3f0dd4e-profile_image-300x300.png',
			followers: '975',
		},
		body: "This is literally one of the most Poggers TTS apps I've ever used, super easy to set up and tons of voices out of the box, AND it works with channel points!",
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
			name: 'L0RACK',
			followers: '663',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/d05bb772-c747-4387-82b5-6e205f528a54-profile_image-300x300.png',
		},
		body: 'free = good TriHard',
		stars: 5,
	},
	{
		author: {
			name: 'BoarBoiLive',
			followers: '584',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/3d304bb9-13f2-4b56-931b-84c2bc442824-profile_image-300x300.png',
		},
		body: 'Why would anyone use normal TTS now? Have GLaDOS roast your gameplay, witness Morgan Freeman have a breakdown, 7/5 This is the future.',
		stars: 5,
	},
	{
		author: {
			name: 'C3AGLE',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/96af8b14-8b41-4948-af83-da7d925304df-profile_image-300x300.png',
			followers: '496',
		},
		body: 'This is a very good tts app and I love it very much',
		stars: 5,
	},
	{
		author: {
			name: 'Chrustosking',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/d76bcdaa-4e23-45cf-aa6f-aa9dc1ebf28f-profile_image-300x300.png',
			followers: '399',
		},
		body: 'Ive been using the AI TTS for over a week now with my stream, the potential it has is amazing. The amount of creativity (depending on twitch chat) is endless, although a few issues and having to restart a lot, its honestly worth it for the content it can provided. I will continue to use AI TTS and support this program as i believe its the future of TTS',
		stars: 4,
	},
	{
		author: {
			name: 'WhatTheWoda',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/662e281d-3883-4d27-86c3-2b24d48f6195-profile_image-300x300.png',
			followers: '234',
		},
		body: "Really fun to use and have people join in on the fun when streaming. It has its features, but for the price, you can't go wrong! Try it, you'll love it!",
		stars: 5,
	},
	{
		author: {
			name: 'IS2511',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/9714c43f-acfd-4c26-bbda-462979bc975a-profile_image-300x300.png',
			followers: '147',
		},
		body: "Good tool NODDERS , those AI voices sure open a lot of trolling possibilities :tf: . I for sure didn't look at the code inside and totally not locked in his baseme-",
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
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/093be1fa-aa9b-4469-bcf2-96278e37c8e1-profile_image-300x300.png',
			followers: '112',
		},
		body: "Some of the funniest moments in my streams came from viewers blind-siding me with TTS. It's especially great for games where I need to focus and can't look at chat. 11/10, would use again.",
		stars: 4,
	},
	{
		author: {
			name: 'VictoryKisses',
			image: 'https://static-cdn.jtvnw.net/jtv_user_pictures/5b6092fa-27dd-4a94-a574-9ac0651f1dff-profile_image-300x300.png',
			followers: '76',
		},
		body: "The AI is so much fun to play with, if you're a small streamer it's a no-brainer. It's hilarious to have Winnie the Pooh being fed lines by an absolute pun lord chatter. It can do bits, points and subs too, all for free, all through your browser. Don't sleep on Solrock.",
		stars: 5,
	},
	{
		author: {
			name: 'johnpaul4444',
			followers: '2',
			image: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-300x300.png',
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
				<Rating value={stars} readOnly />
			</Group>
			<Text className={classes.body} size="lg">
				{body}
			</Text>
		</div>
	);
}

export default function TestimoniesComponent() {
	const autoplay = useRef(Autoplay({ delay: 2000 }));
	const [grabbing, setGrabbing] = useState(false);

	return (
		<Carousel
			sx={{
				marginTop: '-2.5rem',
				marginBottom: '1rem',
				maxWidth: 620,
				'&:hover': {
					cursor: grabbing ? 'grabbing' : 'grab',
				},
			}}
			onMouseDownCapture={() => setGrabbing(true)}
			onMouseUpCapture={() => setGrabbing(false)}
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
