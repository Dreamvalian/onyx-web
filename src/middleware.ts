import { NextRequest, NextResponse } from 'next/server'

// Routes that don't require auth on dashboard
const PUBLIC_API_ROUTES = [
  '/api/auth',
  '/api/guestbook',
  '/api/status',
  '/api/health',
  '/api/cron',
]

function isPublicApiRoute(pathname: string): boolean {
  return PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route))
}

function hasValidSession(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get('discord_session')
  if (!sessionCookie) return false
  try {
    const session = JSON.parse(sessionCookie.value)
    return session?.expires_at > Date.now()
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const pathname = request.nextUrl.pathname

  // dashboard.ko4lax.dev -> require auth for API routes
  if (host === 'dashboard.ko4lax.dev') {
    if (pathname.startsWith('/api/') && !isPublicApiRoute(pathname)) {
      if (!hasValidSession(request)) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
      }
    }
    return NextResponse.next()
  }

  // ko4lax.dev or www.ko4lax.dev -> redirect / to /home
  if (host === 'ko4lax.dev' || host === 'www.ko4lax.dev') {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/home', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static assets — include API routes for auth
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
