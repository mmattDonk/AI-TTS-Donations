// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession as getServerSession } from "next-auth";

import { prisma } from "@solrock/prisma";
import Pusher from "pusher";
import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";

export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions
) => {
  const req = opts?.req;
  const res = opts?.res;

  const session =
    req && res && (await getServerSession(req, res, nextAuthOptions));

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID ?? "",
    cluster: process.env.PUSHER_APP_CLUSTER ?? "",
    key: process.env.PUSHER_APP_KEY ?? "",
    secret: process.env.PUSHER_APP_SECRET ?? "",
  });

  return {
    req,
    res,
    session,
    prisma,
    pusher,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
