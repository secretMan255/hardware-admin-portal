import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import * as moment from 'moment'

export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs))
}

enum Status {
     Deactive = 0,
     Active = 1,
}

export function convertStatus(status: number): string {
     return Status[status] ?? 'Unknown'
}

export function convertUtcToLocal(utcDatetime: string) {
     return moment.utc(utcDatetime).local().format('YYYY-MM-DD')
}

export function getImage(image: string) {
     return `https://storage.googleapis.com/veryhardware/${image}.jpeg`
}

export async function checkAuth(router: any) {
     fetch('/api/check-auth', {
          method: 'GET',
          credentials: 'include', // 🔥 Ensure cookies are sent
     })
          .then((res) => {
               return res.json()
          })
          .then((data) => {
               console.log('🔍 Auth Check Response:', data)
               if (!data.authenticated) {
                    router.push('/login') // Redirect if not authenticated
               }
          })
          .catch((error) => {
               console.error('Error checking authentication:', error)
          })
}
