import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
     const authToken = request.cookies.get('authToken')?.value
     const pathname = request.nextUrl.pathname

     // Allow static files, API requests, and public assets
     if (
          pathname.startsWith('/_next/') || // Next.js static files
          pathname.startsWith('/api/') || // API routes
          pathname.startsWith('/static/') || // Public assets
          pathname.startsWith('/favicon.ico') // Favicon
     ) {
          return NextResponse.next() // Allow these requests
     }

     // Routes that require authentication
     const protectedRoutes = ['/product', '/']
     if (!authToken && protectedRoutes.some((route) => pathname.startsWith(route))) {
          //      // If not authenticated and trying to access a protected route, redirect to /signin
          if (pathname !== '/login') {
               const signInUrl = new URL('/login', request.url)
               return NextResponse.redirect(signInUrl)
          }
     }

     if (authToken && pathname === '/signin') {
          // If authenticated and trying to access /signin, redirect to a protected route
          const homeUrl = new URL('/product', request.url)
          return NextResponse.redirect(homeUrl)
     }

     return NextResponse.next()
}
