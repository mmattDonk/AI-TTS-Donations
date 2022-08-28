import { Accordion, Container, createStyles, Title } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => {
  const control = getRef("control");

  return {
    wrapper: {
      paddingTop: theme.spacing.xl * 2,
      paddingBottom: theme.spacing.xl * 2,
    },

    title: {
      fontWeight: 400,
      marginBottom: theme.spacing.xl * 1.5,
    },

    control: {
      ref: control,

      "&:hover": {
        backgroundColor: "transparent",
      },
    },

    item: {
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.lg,

      border: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[3]
      }`,
    },

    itemOpened: {
      [`& .${control}`]: {
        color:
          // @ts-ignore
          theme.colors[theme.primaryColor][
            theme.colorScheme === "dark" ? 4 : 6
          ],
      },
    },
  };
});

export default function FaqSimple() {
  const { classes } = useStyles();
  return (
    <Container size="sm" className={classes.wrapper}>
      <Title align="center" className={classes.title}>
        Frequently Asked Questions
      </Title>

      <Accordion
        iconPosition="right"
        classNames={{
          item: classes.item,
          itemOpened: classes.itemOpened,
          control: classes.control,
        }}
      >
        <Accordion.Item label="Where can my viewers learn how to use the new TTS?">
          We have a wiki entry to help your viewer get started with using the
          new AI TTS syntax. It's available on{" "}
          <a href="https://github.com/mmattDonk/AI-TTS-Donations/wiki/How-to-use-it!-(viewer)">
            GitHub
          </a>{" "}
          and you can use the shortlink (
          <a href="https://mmatt.link/UseTTS">https://mmatt.link/UseTTS</a>) to
          put in Twitch panels or chat commands.
        </Accordion.Item>
        <Accordion.Item label="Where can I get help with setting up AI TTS Donations?">
          You can join the{" "}
          <a href="https://discord.gg/VUAjRrkZVJ">Discord server</a> and you can
          ask your question and we'll get back to you as soon as possible. If
          you need 1 on 1 support, message "mmatt". Email:{" "}
          <a href="mailto:matt@mmatt.net">matt@mmatt.net</a> or Discord:{" "}
          <a href="https://discord.com/users/308000668181069824">mmatt#0001</a>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
