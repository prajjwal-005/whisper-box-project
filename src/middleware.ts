import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // Back to next/server
import { getToken } from 'next-auth/jwt';
export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
 
  const secret = process.env.AUTH_SECRET;

  const token = await getToken({ 
    req: request, 
    secret,
    salt: process.env.NODE_ENV === 'production' 
      ? '__Secure-authjs.session-token' 
      : 'authjs.session-token'
  });

  if (token && (
    url.pathname === '/' || 
    url.pathname.startsWith('/sign-in') || 
    url.pathname.startsWith('/sign-up')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}