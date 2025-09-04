import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// For simplicity, we'll use a predefined password.
// In a production environment, use a proper database and password hashing.
const ADMIN_PASSWORD = "secure_password_123"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple authentication logic - in a real app, validate against a database
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
    jwt: async ({ token, user }) => {
      // Add user information to the token if available
      if (user) {
        token.role = user.role
      }
      return token
    },
    session: async ({ session, token }) => {
      // Add user role to the session from the token
      if (session.user) {
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || "YOUR_FALLBACK_SECRET_KEY_CHANGE_THIS",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
