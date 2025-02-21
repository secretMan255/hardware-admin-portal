import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
     console.log('🔍 Checking authentication in API route...')
     console.log('Incoming Cookies:', request.cookies.getAll())
     const authToken = request.cookies.get('authToken')?.value

     return NextResponse.json({ authenticated: !!authToken }, { status: 200 })
}
