import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
     // Get authToken from cookies
     const authToken = (await cookies()).get('authToken')?.value
     const pathname = request.nextUrl.pathname

     console.log('Middleware Running')
     console.log('authToken:', authToken, 'pathname:', pathname)

     // Allow static files, API requests, and public assets
     if (
          pathname.startsWith('/_next/') || // Next.js static files
          pathname.startsWith('/api/') || // API routes
          pathname.startsWith('/static/') || // Public assets
          pathname.startsWith('/favicon.ico') // Favicon
     ) {
          return NextResponse.next() // Allow these requests
     }

     // Define protected routes
     const protectedRoutes = ['/product', '/item', '/mainproduct', '/image', '/carousel']

     // If user is not authenticated and tries to access protected routes, redirect to /login
     if (!authToken && protectedRoutes.some((route) => pathname.startsWith(route))) {
          console.log('User not authenticated. Redirecting to /login.')
          return NextResponse.redirect(new URL('/login', request.url))
     }

     // If user is authenticated and tries to access /login, redirect to a protected route
     if (authToken && pathname === '/login') {
          console.log('User already authenticated. Redirecting to /product.')
          return NextResponse.redirect(new URL('/product', request.url))
     }

     return NextResponse.next()
}

// Apply middleware to all routes
export const config = {
     matcher: ['/((?!_next|static|favicon.ico|api).*)'], // Apply to all routes except static files and API
}
