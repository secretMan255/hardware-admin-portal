'use client'

import './globals.css'
import React from 'react'
import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'

export default function RootLayout({ children }: { children: React.ReactNode }) {
     const pathname = usePathname()
     const hideSidebar = pathname === '/login'

     return (
          <html lang="en" data-theme="light">
               <body>
                    <main>
                         {!hideSidebar ? (
                              <SidebarProvider>
                                   <AppSidebar>
                                        <div className="flex flex-col flex-grow">
                                             <header className="flex h-16 shrink-0 items-center gap-2">
                                                  <div className="flex items-center gap-2 px-4">
                                                       <SidebarTrigger className="-ml-1" />
                                                  </div>
                                             </header>
                                             <div className="pl-4 pr-4">{children}</div>
                                        </div>
                                   </AppSidebar>
                              </SidebarProvider>
                         ) : (
                              <div className="flex flex-col flex-grow">{children}</div>
                         )}
                    </main>
                    <footer className="p-4 bg-base-300 text-center">
                         <p>© 2025 My App</p>
                    </footer>
               </body>
          </html>
     )
}
