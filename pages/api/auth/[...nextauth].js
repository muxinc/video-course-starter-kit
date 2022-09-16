import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "utils/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  ],
}

export default NextAuth(authOptions)