import {
  Avatar,
  Button,
  Code,
  Collapse,
  Container,
  Group,
  Space,
  Stack,
  Table,
  Tooltip,
} from "@mantine/core";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
import LoadingPage, { LoadingSpinner } from "../components/Loading";
import Spring from "../components/Spring";
import { trpc } from "../utils/trpc";

export default function Dashboard() {
  const [sensitiveOpen, setSensitiveOpen] = useState(false);

  const [skipMessage, setSkipMessage] = useState("");
  // const [recentTtsMessages, setRecentTtsMessages] = useState<
  //   typeof prisma.tTSMessages[] | null | undefined
  // >(null);

  const skipMutation = trpc.useMutation(["tts.skip-tts"]);
  const { data: session, isLoading: isSessionLoading } = trpc.useQuery([
    "auth.getSession",
  ]);
  const { data: userData, isLoading } = trpc.useQuery([
    "user.get-user",
    session?.user?.name ?? "",
  ]);

  const { data: ttsMessages, isLoading: isTtsMessagesLoading } = trpc.useQuery([
    "tts.get-recent-messages",
    {
      streamerId: userData?.streamers[0]?.id,
    },
  ]);

  // if (!isTtsMessagesLoading) {
  //   if (ttsMessages) {
  //     // @ts-ignore
  //     if (!ttsMessages.success) setRecentTtsMessages(ttsMessages.messages);
  //   }
  // }

  const skipTts = async (e: any) => {
    e.preventDefault();

    skipMutation.mutate({ overlayId: userData?.streamers[0]?.overlayId ?? "" });

    if (skipMutation.isLoading) {
      setSkipMessage("Skipping TTS");
    } else {
      if (skipMutation.data?.success) {
        setSkipMessage("");
      } else {
        setSkipMessage("Failed to skip TTS");
      }
    }
  };

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
              <Group>
                <Button onClick={skipTts}>Skip TTS</Button>
                {skipMutation.isLoading && (
                  <>
                    <LoadingSpinner /> <p>{skipMessage}</p>
                  </>
                )}
              </Group>
              <Space h="md" />
              {isTtsMessagesLoading ? (
                <LoadingSpinner />
              ) : (
                <div>
                  {
                    <Table>
                      <thead>
                        <tr>Message</tr>
                        <tr>Audio Url</tr>
                      </thead>

                      <tbody>
                        {ttsMessages?.messages?.map((message) => (
                          <tr key={message.id}>
                            <td>{message.message}</td>
                            <td>{message.audioUrl}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  }
                </div>
              )}
              <Space h="md" />
              <Button color="red" onClick={() => setSensitiveOpen((o) => !o)}>
                {sensitiveOpen ? "Close" : "Open"} Sensitive Information (DO NOT
                OPEN ON STREAM.)
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
