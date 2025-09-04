import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, `getServerSession`
   */
  interface Session {
    user: {
      /** The user's role. */
      role?: string;
    } & DefaultSession["user"];
  }

  /**
   * User object shape returned from OAuth providers and from database adapters
   */
  interface User {
    /** The user's role. */
    role?: string;
  }
}

declare module "next-auth/jwt" {
  /** JWT token contents */
  interface JWT {
    /** The user's role */
    role?: string;
  }
}
