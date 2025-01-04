// src/middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const token = req.nextauth.token;

    // Block non-authenticated users
    if (!token) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }

    // ADMIN CHECK - If admin and isFirstTimeUser, DON'T redirect
    if (token.role === 'ADMIN') {
      return NextResponse.next();
    }

    // For non-admin users:
    // 1. Block admin routes
    if (path.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/account', req.url));
    }

    // 2. Handle first-time users
    if (token.isFirstTimeUser && path === '/account') {
      return NextResponse.redirect(new URL('/studio', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

export const config = {
  matcher: [
    "/studio/:path*",
    "/account/:path*",
    "/admin/:path*",
    "/api/studio/:path*",
    "/api/protected/:path*"
  ]
}
