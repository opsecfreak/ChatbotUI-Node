import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { DefaultSession, NextAuthConfig } from "next-auth"

// Define admin password - In production, use a secure database
const ADMIN_PASSWORD = "secure_password_123"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      role?: string
    } & DefaultSession["user"]
  }
  
  interface User {
    role?: string
  }
}

// Configure NextAuth
export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple password check
        if (credentials?.password === ADMIN_PASSWORD) {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin"
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user // If there's a user, they're authorized
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
}

// Export NextAuth handler
const handler = NextAuth(authConfig)
export { handler as GET, handler as POST }
