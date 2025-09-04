import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

// This function can be marked `async` if using `await` inside
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

  // For API routes, use auth() will be called in the API route handler
  if (path.startsWith("/api/")) {
    return NextResponse.next();
  }

  const session = await auth();
  
  // For non-API routes, redirect to sign in page if not authenticated
  if (!session) {
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
