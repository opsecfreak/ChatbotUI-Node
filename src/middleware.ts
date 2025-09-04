import { auth } from "../auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // If the user is not logged in and is trying to access a protected API route,
  // return a 401 Unauthorized response. The matcher already excludes /api/auth.
  if (nextUrl.pathname.startsWith('/api/') && !isLoggedIn) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // For all other cases, including protected page routes, the default behavior of `auth`
  // will handle redirection to the sign-in page correctly if the user is not logged in.
});

export const config = {
  matcher: [
    // Match all API routes except auth
    "/api/((?!auth).)*",
    // Match all pages except auth pages
    "/((?!auth|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
