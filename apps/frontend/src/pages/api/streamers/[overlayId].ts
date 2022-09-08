import { prisma } from "@solrock/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // if secret not in request headers, return unauthorized
  if (!req.headers.secret) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  } else if (req.headers.secret !== process.env.API_SECRET) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  const { overlayId } = req.query;
  console.log(overlayId);
  const streamer = await prisma.streamer.findFirst({
    where: {
      overlayId: overlayId as string,
    },
    include: {
      ttsmessages: true,
      user: true,
    },
  });

  if (!streamer) {
    res.status(404).json({ message: "Streamer not found" });
    return;
  }

  switch (req.method) {
    case "GET":
      console.log(overlayId);

      console.log(streamer);
      res.status(200).json({
        message: "streamer found!",
        streamer: streamer,
      });
      return;
    case "POST":
      // im using this specifically for adding a new tts message so yeah
      const { message, audioUrl } = req.body as {
        message: string;
        audioUrl: string;
      };
      console.log(streamer?.id);
      const newMessage = await prisma.ttsMessages.create({
        data: {
          message: message,
          audioUrl: audioUrl,
          streamerId: streamer?.id ?? "",
        },
      });

      res.status(200).json({
        message: "message added!",
        newMessage: newMessage,
      });
  }
}
