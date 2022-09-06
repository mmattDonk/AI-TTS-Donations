import { z } from "zod";
import { createRouter } from "./context";

export const ttsRouter = createRouter().mutation("skip-tts", {
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
});
