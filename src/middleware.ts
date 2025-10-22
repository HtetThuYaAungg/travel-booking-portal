import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from "jwt-decode";


const loggedOutPath = ['/login'];


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loginUrl = new URL('/login', request.url);
  const homeUrl = new URL('/', request.url);

  const accessToken = request.cookies.get(process.env.NEXT_PUBLIC_USER_ACCESS_TOKEN as string)?.value;

  if (!accessToken) {
    return loggedOutPath.includes(pathname) ? NextResponse.next() : NextResponse.redirect(loginUrl);
  }

  

  let decodedToken: any;
  try {
    decodedToken = jwtDecode(accessToken);
  } catch (error) {
    console.error('Invalid token:', error);
    return NextResponse.redirect(loginUrl);
  }

  const { sub: userId } = decodedToken;

  if (!userId) {
    console.error('Invalid token: missing user identifier');
    return NextResponse.redirect(loginUrl);
  }

    if (loggedOutPath.includes(pathname)) {
    return NextResponse.redirect(homeUrl);
  }

  if (pathname === '/setting') {
      return NextResponse.redirect(new URL('/setting/users', request.url));
  }

  // Default: Allow access
  return NextResponse.next();
}

export const config = {
   matcher: [
    '/((?!api|_next/static|_next/image|_next/data|.*\\.(?:png|mp4|json)$).*)'
  ]
};
