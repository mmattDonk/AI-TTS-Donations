import { z } from "zod";
import { createRouter } from "./context";

export const ttsRouter = createRouter()
  .mutation("retrigger-tts", {
    input: z.object({
      audioUrl: z.string(),
      overlayId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { audioUrl, overlayId } = input;
      const { pusher } = ctx;
      try {
        pusher.trigger(overlayId, "new-file", { file: audioUrl });
      } catch (e) {
        return {
          success: false,
        };
      }

      return {
        success: true,
      };
    },
  })
  .mutation("skip-tts", {
    input: z.object({
      overlayId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { overlayId } = input;
      const { pusher } = ctx;
      try {
        pusher.trigger(overlayId, "skip-tts", {});
      } catch (e) {
        return {
          success: false,
        };
      }
      return {
        success: true,
      };
    },
  })
  .query("get-recent-messages", {
    input: z.object({
      streamerId: z.string().nullish(),
    }),
    async resolve({ input, ctx }) {
      const { streamerId } = input;
      const { prisma } = ctx;
      if (!streamerId)
        return {
          success: false,
          message: "streamer not found",
        };
      const messages = await prisma.tTSMessages.findMany({
        where: {
          streamerId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (!messages) return { success: true, messages: null };
      return { success: true, messages: messages };
    },
  });
