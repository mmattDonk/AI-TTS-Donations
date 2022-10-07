import { Container, createStyles, SimpleGrid, Text } from "@mantine/core";
import React from "react";
import { Adjustments, Coin, Globe, Truck, Volume } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
  feature: {
    position: "relative",
    paddingTop: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
  },

  overlay: {
    position: "absolute",
    height: 100,
    width: 165,
    top: 0,
    left: 0,
    backgroundColor:
      theme.colorScheme === "dark"
        ? //@ts-ignore
          theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : //@ts-ignore
          theme.colors[theme.primaryColor][0],
    zIndex: 1,
  },

  content: {
    position: "relative",
    zIndex: 2,
  },

  icon: {
    color:
      //@ts-ignore
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6],
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
}));

interface FeatureProps extends React.ComponentPropsWithoutRef<"div"> {
  icon: React.FC<React.ComponentProps<typeof Truck>>;
  title: string;
  description: string;
}

function Feature({
  icon: Icon,
  title,
  description,
  className,
  ...others
}: FeatureProps) {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.feature, className)} {...others}>
      <div className={classes.overlay} />

      <div>
        <Icon size={38} className={classes.icon} />
        <Text weight={700} size="lg" mb="xs" mt={5} className={classes.title}>
          {title}
        </Text>
        <Text color="dimmed" size="sm">
          {description}
        </Text>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Coin,
    title: "Free to use",
    description:
      "All features in AI TTS Donations are completely free. No fees, and no subscriptions. Simply download, setup, and use. No payments required at all.",
  },
  {
    icon: Globe,
    title: "Open Source",
    description: `AI TTS Donations is completely open sourced under the 'AGPL-3' licence. You can view the Source Code and contribute to it on the GitHub page.`,
  },
  {
    icon: Volume,
    title: "1000+ Voices",
    description: `AI TTS Donations is built using the APIs of Uberduck.ai and Fakeyou.com. This means that you have access to THOUSANDS of public voices on BOTH of these websites, and your audience can use them to create amazing TTS messages.`,
  },
  {
    icon: Adjustments,
    title: "Voice Effects",
    description: `AI TTS Donations has the ability to add voice effects and sound effects to your TTS messages. Voice effects can allow your viewer to pitch up/down voices, add reverb, reduce quality, etc.`,
  },
  {
    icon: Volume,
    title: "Sound Effects",
    description: `Sound effects can add a variety of noises to your viewer's TTS messages. Your viewers can create amazing TTS messages using these features.`,
  },
];

export default function Features() {
  const items = features.map((item) => <Feature {...item} key={item.title} />);

  return (
    <Container mt={30} mb={30} size="lg">
      <SimpleGrid
        cols={3}
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        spacing={50}
      >
        {items}
      </SimpleGrid>
    </Container>
  );
}
