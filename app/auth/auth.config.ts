import { CredentialsSignin, type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "../utils/db";

export default {
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );

        if (!isValidPassword) {
          return null;
        }
        if (!user.emailVerified) {
          throw Error;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "",
          image: user.image ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create a new user entry if they don't exist
          existingUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name ?? "",
              image: user.image ?? null,
              password: null,
            },
          });

          // Link OAuth account
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: "oauth",
            },
          });

          return true; // Allow login
        }

        // If user exists but their account isn't linked, link it
        const existingAccount = await prisma.account.findFirst({
          where: { provider: account.provider, userId: existingUser.id },
        });

        if (!existingAccount) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: "oauth",
            },
          });
        }

        return true; // Allow login
      }

      return true; // Allow other authentication methods
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = typeof user.image === "string" ? user.image : null;
      }

      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          image: token.image,
        };
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
