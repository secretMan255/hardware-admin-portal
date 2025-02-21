'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { checkAuth } from '@/lib/utils'

export default function Home() {
     const router = useRouter()

     useEffect(() => {
          checkAuth(router)
     }, [router])

     return <div></div>
}
