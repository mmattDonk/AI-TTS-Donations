import { Accordion, Container, createStyles, Title } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
  },

  title: {
    marginBottom: theme.spacing.xl * 1.5,
  },

  item: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,

    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

export default function FaqSimple() {
  const { classes } = useStyles();
  return (
    <Container size="sm" className={classes.wrapper}>
      <Title align="center" className={classes.title}>
        Frequently Asked Questions
      </Title>

      <Accordion variant="separated">
        <Accordion.Item className={classes.item} value="viewer-learn">
          <Accordion.Control>
            Where can my viewers learn how to use the new TTS?
          </Accordion.Control>
          <Accordion.Panel>
            We have a wiki entry to help your viewer get started with using the
            new AI TTS syntax. It's available on{" "}
            <a href="https://github.com/mmattDonk/AI-TTS-Donations/wiki/How-to-use-it!-(viewer)">
              GitHub
            </a>{" "}
            and you can use the shortlink (
            <a href="https://mmatt.link/UseTTS">https://mmatt.link/UseTTS</a>)
            to put in Twitch panels or chat commands.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="get-help">
          <Accordion.Control>
            Where can I get help with setting up AI TTS Donations?
          </Accordion.Control>
          <Accordion.Panel>
            {" "}
            You can join the{" "}
            <a href="https://discord.gg/VUAjRrkZVJ">Discord server</a> and you
            can ask your question and we'll get back to you as soon as possible.
            If you need 1 on 1 support, message "mmatt". Email:{" "}
            <a href="mailto:matt@mmatt.net">matt@mmatt.net</a> or Discord:{" "}
            <a href="https://discord.com/users/308000668181069824">
              mmatt#0001
            </a>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
