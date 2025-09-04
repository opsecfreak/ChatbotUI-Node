import "next-auth";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, `getServerSession`
   */
  interface Session {
    user: {
      /** The user's role. */
      role?: string;
      /** The user's unique ID. */
      id?: string;
      /** The user's GitHub username (if using GitHub provider). */
      username?: string;
      /** The authentication provider (e.g., 'github', 'credentials'). */
      provider?: string;
    } & DefaultSession["user"];
  }

  /**
   * User object shape returned from OAuth providers and from database adapters
   */
  interface User {
    /** The user's role. */
    role?: string;
    /** The user's GitHub username (if using GitHub provider). */
    username?: string;
    /** The authentication provider (e.g., 'github', 'credentials'). */
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  /** JWT token contents */
  interface JWT {
    /** The user's role */
    role?: string;
    /** The user's GitHub username (if using GitHub provider). */
    username?: string;
    /** The authentication provider (e.g., 'github', 'credentials'). */
    provider?: string;
  }
}
