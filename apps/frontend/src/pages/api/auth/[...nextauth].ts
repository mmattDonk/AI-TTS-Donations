import NextAuth, { type NextAuthOptions } from "next-auth";
import TwitchProvider from "next-auth/providers/twitch";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_ID ?? "",
      clientSecret: process.env.TWITCH_SECRET ?? "",
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
