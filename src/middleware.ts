import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const isPublicPath = 
    path === "/auth/signin" || 
    path.startsWith("/api/auth") ||
    path === "/favicon.ico";

  if (isPublicPath) {
    return NextResponse.next();
  }

  // For all routes, get the token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Check if it's an API route that needs protection
  if (path.startsWith("/api/")) {
    // If no token or token is not valid, return unauthorized for API routes
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }
  
  // For non-API routes, redirect to sign in page if not authenticated
  if (!token) {
    // Store the original URL the user was trying to access
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(url);
  }

  // Continue to the protected route
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Match all API routes except auth
    "/api/((?!auth).)*",
    // Match all pages except auth pages
    "/((?!auth|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
