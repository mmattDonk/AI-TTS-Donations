import {
  Avatar,
  Button,
  Code,
  Collapse,
  Container,
  Group,
  Space,
  Stack,
  Tooltip,
} from "@mantine/core";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import LoadingPage, { LoadingSpinner } from "../components/Loading";
import Spring from "../components/Spring";
import { trpc } from "../utils/trpc";

export default function Dashboard() {
  const [sensitiveOpen, setSensitiveOpen] = useState(false);

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
          <Stack mt="xl" mb="xl" spacing="xs">
            <Group>
              <Avatar src={session.user?.image} size="lg" />
              <h1>Your Dashboard</h1>
            </Group>
            <Group>
              <p>Logged in as {session.user?.name}</p>
              <Button color="gray" size="xs" onClick={() => signOut()}>
                Sign Out
              </Button>
            </Group>
          </Stack>
          <hr />
          <Space h="xl" />
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Button color="red" onClick={() => setSensitiveOpen((o) => !o)}>
                Open Sensitive Information (DO NOT OPEN ON STREAM.)
              </Button>
              <Collapse in={sensitiveOpen}>
                <p>
                  <Tooltip label="WARNING: DO NOT SHOW OVERLAY LINK ON STREAM. IT CONTAINS SENSITIVE INFORMATION.">
                    <a
                      href={`/overlay/${userData?.streamers[0]?.overlayId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      TTS Overlay
                    </a>
                  </Tooltip>{" "}
                  - This is where your TTS audio will be playing, simply copy
                  the link, and paste it into a <Code>Browser Source</Code> in
                  your preferred streaming software (like OBS).
                </p>
              </Collapse>
            </>
          )}
        </Spring>
      </Container>
    );
  }

  return <LoadingPage />;
}
