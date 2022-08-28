import { Avatar, Button, Container, Group, Stack } from "@mantine/core";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import LoadingPage from "../components/Loading";
import Spring from "../components/Spring";
import { trpc } from "../utils/trpc";

const Dashboard: NextPage = () => {
  const { data: session, isLoading: isSessionLoading } = trpc.useQuery([
    "auth.getSession",
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
        </Spring>
      </Container>
    );
  }

  return <LoadingPage />;
};

export default Dashboard;
