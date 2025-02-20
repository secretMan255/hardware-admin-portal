import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
     // Use `cookies()` for Next.js 13+ middleware
     const authToken = (await cookies()).get('authToken')?.value
     const pathname = request.nextUrl.pathname

     console.log('Request Cookies:', request.headers.get('cookie'))
     console.log('authToken: ', authToken, 'pathname: ', pathname)

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
     const protectedRoutes = ['/product', '/item', '/']
     if (!authToken && protectedRoutes.some((route) => pathname.startsWith(route))) {
          // If not authenticated and trying to access a protected route, redirect to /login
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
