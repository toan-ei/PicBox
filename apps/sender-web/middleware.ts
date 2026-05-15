import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ─── DEV MODE: bỏ qua auth để test UI thoải mái ─────────────
  // Xóa hoặc comment block này khi deploy production
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }
  // ─────────────────────────────────────────────────────────────

  const token = request.cookies.get('auth_token')?.value

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    if (token && pathname.startsWith('/auth/login')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}