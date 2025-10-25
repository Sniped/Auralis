import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for protecting routes
 * 
 * Note: This middleware provides basic route protection at the edge.
 * Since Cognito tokens are stored in browser localStorage, the actual
 * authentication check happens client-side in the protected components.
 * 
 * This middleware primarily serves to:
 * - Define which routes should be protected
 * - Allow public access to /signin
 * - Provide a consistent auth flow pattern
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public access to signin page
  if (pathname === '/signin') {
    return NextResponse.next();
  }

  // Dashboard and sub-routes are protected
  // Actual auth check happens client-side since tokens are in localStorage
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which routes should run through middleware
export const config = {
  matcher: ['/dashboard/:path*', '/signin'],
};
