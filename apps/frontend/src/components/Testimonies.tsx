import { Carousel } from "@mantine/carousel";
import { Avatar, createStyles, Group, Text } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { Star } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm,
  },
}));

const testimonies: CommentSimpleProps[] = [
  {
    author: {
      name: "LiptonGod",
      image:
        "https://cdn.7tv.app/pp/60532eaab4d31e459f727bcd/4d77d7a5f1824289a3c67188046d02d3",
      followers: "923",
    },
    body: "Ever since seeing AI TTS Donations, I immediately got hooked, You cannot go wrong with having a free AI TTS, most definitely recommend this to those who are not able to pay for stuff like this.",
    stars: 5,
  },
  {
    author: {
      name: "AuroR6S",
      image:
        "https://static-cdn.jtvnw.net/jtv_user_pictures/73cca255-1a58-40a8-8cb9-983aa9392372-profile_image-300x300.png",
      followers: "146",
    },
    body: "I love this app! It breaks sometimes but its very good!",
    stars: 5,
  },
  {
    author: {
      name: "K_A_L_Y",
      image:
        "https://static-cdn.jtvnw.net/jtv_user_pictures/83c01131-e303-4a04-b2ec-7445facad5b1-profile_image-70x70.png",
      followers: "2.9K",
    },
    body: "I had a lot of fun playing around with AI TTS thank you for making this plugin.",
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
        {[...Array(stars)].map((i) => (
          <Star key={i} color="gold" fill="gold" />
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
        marginBottom: "1rem",
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Testimonial {...t} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
