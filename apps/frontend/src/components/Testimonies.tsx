import { Carousel } from "@mantine/carousel";
import { Avatar, createStyles, Group, Text } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm,
  },
}));

const testimonies: CommentSimpleProps[] = [
  {
    author: {
      name: "mmattbtw",
      image:
        "https://static-cdn.jtvnw.net/jtv_user_pictures/aef1b6dd-d45f-4e68-92e5-8c9dfac4122c-profile_image-70x70.png",
    },
    body: "lorem ipsum dolor sit amet",
  },
];

interface CommentSimpleProps {
  body: string;
  author: {
    name: string;
    image: string;
  };
}

function Testimonial({ body, author }: CommentSimpleProps) {
  const { classes } = useStyles();
  return (
    <div>
      <Group>
        <Avatar src={author.image} alt={author.name} radius="xl" />
        <div>
          <Text size="lg">{author.name}</Text>
        </div>
      </Group>
      <Text className={classes.body} size="lg">
        {body}
      </Text>
    </div>
  );
}

export default function TestimoniesComponent() {
  return (
    <Carousel
      style={{
        marginBottom: "2rem",
        maxWidth: 620,
      }}
      withIndicators
      height={200}
      loop
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
