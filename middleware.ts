import { NextRequest, NextResponse } from 'next/server';

//===========================================================================

const privateRoutes = ['/profile', '/notes'];
const publicAuthRoutes = ['/sign-in', '/sign-up'];

//===========================================================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivate = privateRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = publicAuthRoutes.some(route =>
    pathname.startsWith(route)
  );

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  if (!isAuthenticated && isPrivate) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

//===========================================================================

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
