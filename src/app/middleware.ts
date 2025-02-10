import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
     const authToken = request.cookies.get('authToken')?.value // Retrieve the auth token from cookies
     const pathname = request.nextUrl.pathname
     console.log('nihao')
     // Routes that require authentication
     const protectedRoutes = ['/', '/product']

     if (!authToken && protectedRoutes.some((route) => pathname.startsWith(route))) {
          // If not authenticated and trying to access a protected route, redirect to /signin
          const signInUrl = new URL('/signin', request.url)
          return NextResponse.redirect(signInUrl)
     }

     if (authToken && pathname === '/signin') {
          // If authenticated and trying to access /signin, redirect to the homepage or dashboard
          const homeUrl = new URL('/', request.url)
          return NextResponse.redirect(homeUrl)
     }

     return NextResponse.next()
}
