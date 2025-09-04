import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

// For simplicity, we'll use a predefined password.
const ADMIN_PASSWORD = "secure_password_123"

export const config = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is where you'd validate against a database
        if (credentials?.password === ADMIN_PASSWORD) {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin"
          }
        }
        // Return null if authentication fails
        return null
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "YOUR_FALLBACK_SECRET_KEY_CHANGE_THIS",
} satisfies NextAuthConfig

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(config)
