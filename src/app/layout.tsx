'use client'

import './globals.css'
import React from 'react'
import { usePathname } from 'next/navigation'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { useMediaQuery } from '@/lib/use-media-query'

export default function RootLayout({ children }: { children: React.ReactNode }) {
     const pathname = usePathname()
     const hideSidebar = pathname === '/login'
     const isMobile = useMediaQuery('(max-width: 900px)')

     return (
          <html lang="en" data-theme="light">
               <body>
                    {!hideSidebar ? (
                         <SidebarProvider>
                              <AppSidebar />
                              <main className={`w-full relative ${isMobile ? 'mt-14' : 'mt-5'}`}>
                                   <div className="w-full max-w-7xl mx-auto">{children}</div>
                              </main>
                         </SidebarProvider>
                    ) : (
                         <main>
                              <div className="flex flex-col flex-grow">{children}</div>
                         </main>
                    )}
                    <footer className="p-4 bg-base-300 text-center">
                         <p>© 2025 My App</p>
                    </footer>
               </body>
          </html>
     )
}
