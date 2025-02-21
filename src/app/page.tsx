'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { checkAuth } from './api/check-auth/route'

export default function Home() {
     const router = useRouter()

     useEffect(() => {
          checkAuth(router)
     }, [])

     return <div></div>
}
