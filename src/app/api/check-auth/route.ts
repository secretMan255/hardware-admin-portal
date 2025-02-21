import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
     const authToken = request.cookies.get('authToken')?.value

     if (!authToken) {
          return NextResponse.json({ authenticated: false }, { status: 200 })
     }

     return NextResponse.json({ authenticated: true }, { status: 200 })
}

export async function checkAuth(router: any) {
     fetch('/api/check-auth', {
          method: 'GET',
          credentials: 'include', // 🔥 Ensure cookies are sent
     })
          .then((res) => {
               if (!res.ok) {
                    return { authenticated: false }
               }
               return res.json()
          })
          .then((data) => {
               if (!data.authenticated) {
                    router.push('/login') // Redirect if not authenticated
               }
          })
          .catch((error) => {
               console.error('Error checking authentication:', error)
          })
}
