import {
  Avatar,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import type { NextPage } from "next";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRef, useState } from "react";
import Bubbles from "../components/Bubbles";
import Dots from "../components/Dots";
import FaqSimple from "../components/FAQ";
import Features from "../components/Features";
import { LoadingSpinner } from "../components/Loading";
import Spring from "../components/Spring";
import TestimoniesComponent from "../components/Testimonies";
import { trpc } from "../utils/trpc";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: 120,
    paddingBottom: 80,

    "@media (max-width: 755px)": {
      paddingTop: 80,
      paddingBottom: 60,
    },
  },

  inner: {
    position: "relative",
    zIndex: 1,
  },

  dots: {
    position: "absolute",
    color:
      theme.colorScheme === "dark"
        ? // @ts-ignore
          theme.colors.dark[5]
        : // @ts-ignore
          theme.colors.gray[1],

    "@media (max-width: 755px)": {
      display: "none",
    },
  },

  dotsLeft: {
    left: 0,
    top: 0,
  },

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    "@media (max-width: 520px)": {
      fontSize: 28,
      textAlign: "left",
    },
  },

  description: {
    textAlign: "center",

    "@media (max-width: 520px)": {
      textAlign: "left",
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",

    "@media (max-width: 520px)": {
      flexDirection: "column",
    },
  },

  control: {
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    "@media (max-width: 520px)": {
      height: 42,
      fontSize: theme.fontSizes.md,

      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

const Home: NextPage = () => {
  const { data: session, isLoading } = trpc.useQuery(["auth.getSession"]);
  const { classes } = useStyles();

  const BRRef = useRef<HTMLBRElement>(null);
  const inputElement = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  const scrollToPositions = () =>
    BRRef.current?.scrollIntoView({ behavior: "smooth" });

  const formMutation = trpc.useMutation(["mailing-list.subscribe"]);

  const subscribe = async (e: any) => {
    e.preventDefault();
    if (!inputElement.current?.value) return;

    formMutation.mutate({ email: inputElement.current.value });
    if (!formMutation.isLoading) {
      if (formMutation.data?.success === false) {
        setMessage(formMutation.data?.error);
        return;
      } else {
        setMessage("You have been subscribed!");
      }
    }
  };

  return (
    // <h1>asdf</h1>
    <>
      <Container>
        <Spring>
          <Group mb={"1rem"} mt={"1rem"} position="right">
            {isLoading ? (
              <LoadingSpinner />
            ) : session ? (
              <>
                <Link href="/dashboard" prefetch>
                  Go To Dashboard
                </Link>
                <Tooltip
                  label={`Logged in as ${session.user?.name}`}
                  position="bottom"
                >
                  <Avatar
                    src={session.user?.image}
                    alt={`${session.user?.name}'s profile picture.`}
                  />
                </Tooltip>
                <Button onClick={() => signOut()} size="xs">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => signIn()} size="xs">
                Sign In
              </Button>
            )}
          </Group>

          <Container className={classes.wrapper} size={1400}>
            <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
            <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
            <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
            <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

            <div className={classes.inner}>
              <Title className={classes.title}>
                The first{" "}
                <Text
                  component="span"
                  variant="gradient"
                  gradient={{
                    from: "blue",
                    to: "#fa99ff",
                  }}
                  inherit
                >
                  100% free
                </Text>{" "}
                AI TTS service for{" "}
                <Text component="span" color={"#9146FF"} inherit>
                  Twitch
                </Text>
              </Title>

              <Container p={0} size={600}>
                <Text size="lg" color="dimmed" className={classes.description}>
                  AI TTS Donations is a free and Open Source AI TTS service for
                  Twitch (and other platforms). It's the first of its class, no
                  subscription services, no additional add-ons, and no ads.
                </Text>
              </Container>

              <div className={classes.controls}>
                <Group>
                  {/* <Link href="/dashboard" prefetch> */}
                  <Tooltip label="We aren't ready yet! Sign up to the mailing list below.">
                    <Button
                      className={classes.control}
                      size="lg"
                      // disabled={isLoading}
                      disabled
                    >
                      Get started
                    </Button>
                  </Tooltip>
                  {/* </Link> */}
                  <Button
                    variant="outline"
                    className={classes.control}
                    size="lg"
                    onClick={scrollToPositions}
                  >
                    Learn more
                  </Button>
                </Group>
              </div>
            </div>
          </Container>

          <h2 style={{ textAlign: "center" }}>How It Works</h2>

          <Center>
            <div
              style={{
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 1)",
                padding: "5px",
                borderRadius: "5px",
              }}
            >
              <Tooltip label="Voice Tag">
                <Text color="yellow" component="span" inherit>
                  spongebob
                </Text>
              </Tooltip>
              :{" "}
              <Tooltip label="Message">
                <Text color="cyan" component="span" inherit>
                  Hey!
                </Text>
              </Tooltip>{" "}
              <Tooltip label="Seperator Character">
                <Text color="green" component="span" inherit>
                  ||
                </Text>
              </Tooltip>{" "}
              <Tooltip label="Voice Tag">
                <Text color="yellow" component="span" inherit>
                  drake
                </Text>
              </Tooltip>
              :{" "}
              <Tooltip label="Message">
                <Text color="cyan" component="span" inherit>
                  Hi Spongebob!
                </Text>
              </Tooltip>{" "}
              <Tooltip label="Seperator Character">
                <Text color="green" component="span" inherit>
                  ||
                </Text>
              </Tooltip>{" "}
              <Tooltip label="Playsound">
                <Text color="violet" component="span" inherit>
                  (
                  <Text color="red" component="span" inherit>
                    1
                  </Text>
                  )
                </Text>
              </Tooltip>{" "}
              <Tooltip label="Seperator Character">
                <Text color="green" component="span" inherit>
                  ||
                </Text>
              </Tooltip>{" "}
              <Tooltip label="Voice Tag">
                <Text color="yellow" component="span" inherit>
                  spongebob
                </Text>
              </Tooltip>
              :{" "}
              <Tooltip label="Message">
                <Text color="cyan" component="span" inherit>
                  OMG So True
                </Text>
              </Tooltip>
            </div>
          </Center>

          <br ref={BRRef} />

          <h1>
            Features that are{" "}
            <Text
              component="span"
              variant="gradient"
              gradient={{
                from: "red",
                to: "#b50000",
              }}
              inherit
            >
              unrivaled
            </Text>{" "}
            compared to anyone else available.
          </h1>

          <Features />

          <br />

          <h1 style={{ textAlign: "center" }}>Don't believe me?</h1>
          <h2 style={{ textAlign: "center" }}>
            Just look at what streamers say about it.
          </h2>
          <TestimoniesComponent />

          <FaqSimple />
        </Spring>
        <Bubbles />
      </Container>
      <div
        style={{
          // background color gradient from comepletely transparent to black
          background: `linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0),
              rgba(0, 0, 0, 1)
            )`,
          paddingTop: "1rem",
          paddingBottom: "2rem",
          width: "100%",
          height: "20rem",
        }}
      >
        <div
          style={{
            // center vertically
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* <h1 style={{ textAlign: "center" }}>
            Sounds good? Get started with AI TTS Donations today for free!
          </h1>
          <Link href="/dashboard" prefetch>
            <Center>
              <Button>Get started</Button>
            </Center>
          </Link> */}
          <h1 style={{ textAlign: "center" }}>Sign up to the mailing list!</h1>
          <p style={{ textAlign: "center" }}>
            We aren't ready to launch yet, but you can sign up to the mailing
            list to get notified when we are.
          </p>

          <form onSubmit={subscribe}>
            <Group>
              <TextInput
                required
                placeholder="yo@youremail.com"
                ref={inputElement}
                type="email"
                id="email-input"
              />

              <Button type="submit" disabled={formMutation.isLoading}>
                Submit
              </Button>
              {formMutation.isLoading && <LoadingSpinner />}
              <div>{!formMutation.isLoading && message}</div>
            </Group>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
