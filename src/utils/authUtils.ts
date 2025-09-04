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

/**
 * Helper function to check if a user has a specific role
 */
export function hasRole(user: any, role: string) {
  return user?.role === role;
}

/**
 * Helper function to verify JWT token directly
 */
export function verifyJwt(token: string): Promise<any> {
  // This would be a JWT verification function
  // For security, you'd validate the signature, expiration, etc.
  // This is a placeholder for actual JWT verification logic
  
  return Promise.resolve(true);
}
