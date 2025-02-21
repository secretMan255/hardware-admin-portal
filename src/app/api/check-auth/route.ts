import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
     const authToken = request.cookies.get('authToken')?.value

     return NextResponse.json({ authenticated: !!authToken }, { status: 200 })
}
