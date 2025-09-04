import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";
import type { DefaultSession } from "next-auth";

// Extend the next-auth types
declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      id?: string;
      username?: string;
      provider?: string;
    } & DefaultSession["user"];
  }
  
  interface User {
    role?: string;
    username?: string;
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    username?: string;
    provider?: string;
  }
}

// In a production environment, use a proper database and password hashing.
if (!process.env.ADMIN_PASSWORD) {
  throw new Error("Missing ADMIN_PASSWORD environment variable");
}

export const authConfig = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: "user",
          username: profile.login,
          provider: "github",
        };
      },
    }),
    Credentials({
      name: "Password",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.password === process.env.ADMIN_PASSWORD) {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
            provider: "credentials",
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith("/");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (request.nextUrl.pathname.startsWith("/api/")) {
        return isLoggedIn; // Protect API routes
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        // Store additional user info in JWT token
        token.role = user.role;
        token.username = user.username;
        token.provider = user.provider;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        // Pass user details from token to session
        session.user.role = token.role as string;
        session.user.username = token.username as string | undefined;
        session.user.provider = token.provider as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
