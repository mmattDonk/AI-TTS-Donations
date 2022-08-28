import { z } from "zod";
import { createRouter } from "./context";

export const userRouter = createRouter().query("get-user", {
  input: z.string(),
  resolve: async ({ ctx, input }) => {
    return await ctx.prisma.user.findFirst({
      where: {
        name: input,
      },
      include: {
        accounts: true,
        sessions: true,
        streamers: true,
      },
    });
  },
});
