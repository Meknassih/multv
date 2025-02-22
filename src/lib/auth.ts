import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { pb } from "./pocketbase";
import { DefaultSession } from "next-auth";

export interface AuthUser {
  id: string;
  token: string;
}

export interface AuthSession {
  user: AuthUser & DefaultSession["user"];
}

declare module "next-auth" {
  interface Session extends AuthSession {}
  interface User extends AuthUser {}
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const authData = await pb
            .collection("users")
            .authWithPassword(credentials.email, credentials.password);

          if (authData?.record) {
            return {
              id: authData.record.id,
              email: authData.record.email,
              name: authData.record.name,
              token: authData.token,
            };
          }
          return null;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          token: token.token as string,
        }
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
      }
      return token;
    },
  },
};
