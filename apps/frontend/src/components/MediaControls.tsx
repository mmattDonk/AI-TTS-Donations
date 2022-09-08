import {
  Button,
  Collapse,
  Container,
  Group,
  Space,
  Stack,
  Table,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Rotate } from "tabler-icons-react";
import { trpc } from "../utils/trpc";
import LoadingPage, { LoadingSpinner } from "./Loading";

export default function MediaControls() {
  const ttsMutation = trpc.useMutation(["tts.retrigger-tts"]);

  const [showTable, setShowTable] = useState(false);

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

  const [skipMessage, setSkipMessage] = useState("");

  const skipMutation = trpc.useMutation(["tts.skip-tts"]);

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

  const replayTts = async (e: any) => {
    e.preventDefault();

    ttsMutation.mutate({
      overlayId: userData?.streamers[0]?.overlayId ?? "",
      audioUrl: e.currentTarget.value,
    });
    console.debug(e.currentTarget.value);

    showNotification({
      title: "Sending TTS",
      message: "",
      loading: ttsMutation.isLoading,
    });
    if (ttsMutation.isError) {
      showNotification({
        title: "Error sending TTS",
        message: ttsMutation.error?.message ?? "",
        color: "red",
      });
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
    return isTtsMessagesLoading ? (
      <LoadingSpinner />
    ) : (
      <div
        style={{
          marginTop: "1rem",
        }}
      >
        <Group>
          <Button color="gray" onClick={skipTts}>
            Skip TTS
          </Button>
          {skipMutation.isLoading && (
            <>
              <LoadingSpinner /> <p>{skipMessage}</p>
            </>
          )}
        </Group>
        <Space h="md" />
        <Button onClick={() => setShowTable((o) => !o)}>
          {showTable ? "Close" : "Open"} Recent TTS Messages
        </Button>
        <Space h="sm" />
        <Collapse in={showTable}>
          <div size="sm">
            <Table>
              <thead>
                <th>Message</th>
                <th>Created At</th>
                <th>Replay</th>
              </thead>

              <tbody></tbody>
            </Table>
            {/* @ts-ignore */}
            {ttsMessages?.messages?.map((message: any) => (
              <Group
                key={message.id}
                style={{
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              >
                <p>{message.message}</p>
                <p>
                  {new Date(
                    // @ts-ignore
                    message.createdAt
                  ).toLocaleDateString()}{" "}
                  at {/* @ts-ignore */}
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
                <div>
                  <Button
                    value={message.audioUrl}
                    color="gray"
                    onClickCapture={replayTts}
                  >
                    <Rotate />
                  </Button>
                </div>
              </Group>
            ))}
          </div>
        </Collapse>
      </div>
    );
  }
  return <LoadingPage />;
}
