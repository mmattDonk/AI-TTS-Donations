import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

export async function getServerSideProps() {
  const PUSHER_APP_KEY = process.env.PUSHER_APP_KEY;
  const PUSHER_APP_CLUSTER = process.env.PUSHER_APP_CLUSTER;

  return {
    props: {
      PUSHER_APP_KEY,
      PUSHER_APP_CLUSTER,
    }, // will be passed to the page component as props
  };
}

export default function Overlay({
  PUSHER_APP_KEY,
  PUSHER_APP_CLUSTER,
}: {
  PUSHER_APP_KEY: string | undefined;
  PUSHER_APP_CLUSTER: string | undefined;
}) {
  const [audioFile, setAudioFile] = useState<string | null>(null);

  const router = useRouter();
  const { overlayId } = router.query;

  useEffect(() => {
    const pusher = new Pusher(PUSHER_APP_KEY ?? "", {
      cluster: PUSHER_APP_CLUSTER,
    });
    console.log(PUSHER_APP_KEY);
    const channel = pusher.subscribe(overlayId as string);
    channel.bind("new-file", (data: { file: string }) => {
      setAudioFile(data.file);
    });
    channel.bind("connected", () => {
      console.log("Connected to channel");
    });
    return () => {
      pusher.unbind_all();
      pusher.unsubscribe(overlayId as string);
      pusher.disconnect();
    };
  });

  return <div>{audioFile && <audio src={audioFile} autoPlay />}</div>;
}
