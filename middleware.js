import { NextResponse } from 'next/server'

export function middleware(request) {
  const auth = request.cookies.get('hp_auth')
  const { pathname } = request.nextUrl

  const isLoginPage = pathname === '/login'
  const isApiRoute = pathname.startsWith('/api')
  const isPublic = isLoginPage || isApiRoute

  if (!auth && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (auth && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
}