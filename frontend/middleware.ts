import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/dashboard', '/admin'];
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // isLoggedIn is a client-set cookie (not httpOnly) that mirrors the auth state.
  // The actual security is enforced by the backend via the httpOnly accessToken.
  // This cookie is set on login/signup and cleared on logout.
  const isLoggedIn = !!request.cookies.get('isLoggedIn')?.value;

  const isProtected = PROTECTED.some(route => pathname.startsWith(route));
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
};
