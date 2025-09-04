import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath = path === "/auth/signin" || 
                      path.startsWith("/api/auth") ||
                      path === "/favicon.ico";

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check if it's an API route that needs protection
  const isApiPath = path.startsWith("/api/");

  if (isApiPath) {
    // For API routes, verify the JWT token
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    // If no token or token is not valid, return unauthorized
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
  }

  // Continue to the protected route
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/api/chat/:path*",
    "/api/user/:path*",
  ],
};
