import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Helper function to check if the user is authenticated in API routes
 */
export async function getAuthenticatedUser(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return { isAuthenticated: false, user: null };
    }
    
    return { 
      isAuthenticated: true, 
      user: {
        id: token.sub,
        name: token.name,
        email: token.email,
        role: token.role,
      } 
    };
  } catch (error) {
    console.error("Auth error:", error);
    return { isAuthenticated: false, user: null };
  }
}

import { User } from "../types";

/**
 * Helper function to check if a user has a specific role
 */
export function hasRole(user: User | null, role: string) {
  return user?.role === role;
}
