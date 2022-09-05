import {
  Avatar,
  Button,
  Container,
  Group,
  Stack,
  Tooltip,
} from "@mantine/core";
import { NextPageContext } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingPage, { LoadingSpinner } from "../components/Loading";
import Spring from "../components/Spring";
import { trpc } from "../utils/trpc";

export async function getInitialProps(ctx: NextPageContext) {
  const { req } = ctx;
  if (req) {
    return { baseUrl: req.headers.host };
  }
}

export default function Dashboard({ baseUrl }: { baseUrl: string }) {
  const router = useRouter();
  const { data: session, isLoading: isSessionLoading } = trpc.useQuery([
    "auth.getSession",
  ]);
  const { data: userData, isLoading } = trpc.useQuery([
    "user.get-user",
    session?.user?.name ?? "",
  ]);

  if (isSessionLoading) return <LoadingPage />;

  if (!session && !isSessionLoading) {
    return (
      <Container
        style={{
          // center vertically
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Stack align="center">
          <h1>You are not logged in.</h1>
          <Button onClick={() => signIn()} size="xl">
            Sign In
          </Button>
        </Stack>
      </Container>
    );
  } else if (session) {
    return (
      <Container>
        <Spring>
          <Group mt="xl">
            <Avatar src={session.user?.image} size="lg" />
            <h1>Logged in as {session.user?.name}</h1>
          </Group>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <p>
                your overlay URL: {baseUrl + "/overlay/"}
                <Tooltip label="click to copy!">
                  <span
                    onClick={() => {
                      navigator.clipboard.writeText(
                        baseUrl +
                          "/overlay/" +
                          userData?.streamers[0]?.overlayId
                      );
                    }}
                  >
                    {userData?.streamers[0]?.overlayId}
                  </span>
                </Tooltip>
              </p>
            </>
          )}
        </Spring>
      </Container>
    );
  }

  return <LoadingPage />;
}
