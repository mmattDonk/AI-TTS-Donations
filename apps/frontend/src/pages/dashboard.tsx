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
import { GetStaticPropsContext } from "next";
import { signIn, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { WindowMaximize } from "tabler-icons-react";
import LoadingPage, { LoadingSpinner } from "../components/Loading";
import MediaControls from "../components/MediaControls";
import Spring from "../components/Spring";
import { trpc } from "../utils/trpc";

export default function Dashboard() {
  const [sensitiveOpen, setSensitiveOpen] = useState(false);
  const t = useTranslations();

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
      <Container size="xl">
        <Spring>
          <Stack mt="xl" mb="xl" spacing="xs">
            <Group>
              <Avatar src={session.user?.image} size="lg" />
              <h1>{t("Dashboard.yourDash")}</h1>
            </Group>
            <Group>
              <p>{t("loggedIn", { name: session.user?.name })}</p>
              <Button color="gray" size="xs" onClick={() => signOut()}>
                {t("signOut")}
              </Button>
            </Group>
          </Stack>
          <div
            style={{
              border: "1px solid white",
              padding: "1rem",
            }}
          >
            <WindowMaximize
              onClick={() => {
                window.open("/mediacontrols", "_blank", "popup=true");
              }}
              // on hover, make icon blue and cursor pointer
              style={{
                color: "white",
                cursor: "pointer",
              }}
            />
            <MediaControls />
          </div>
          <hr />
          <Space h="xl" />
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Space h="md" />

              <Button color="red" onClick={() => setSensitiveOpen((o) => !o)}>
                {sensitiveOpen ? t("close") : t("open")}{" "}
                {t("Dashboard.sensitiveInfo")}
              </Button>
              <Collapse in={sensitiveOpen}>
                <p>
                  <Tooltip label={t("Dashboard.sensitiveInfoWarning")}>
                    <a
                      href={`/overlay/${userData?.streamers[0]?.overlayId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("Dashboard.ttsOverlay")}
                    </a>
                  </Tooltip>{" "}
                  -{" "}
                  {t.rich("Dashboard.ttsOverlayDescription", {
                    // @ts-ignore
                    Code: (children) => <Code>{children}</Code>,
                  })}
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

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../../i18n/${locale}.json`)).default,
    },
  };
}
