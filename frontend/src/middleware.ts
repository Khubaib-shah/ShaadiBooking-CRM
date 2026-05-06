import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasRefreshToken = request.cookies.has('refreshToken')
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  // For development, skip auth checks
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  if (!hasRefreshToken && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (hasRefreshToken && isPublic) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.svg).*)'],
}
