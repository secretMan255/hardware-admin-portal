'use client'

import './globals.css'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function RootLayout({
     children,
}: Readonly<{
     children: React.ReactNode
}>) {
     const [navbarTitle, setNavbarTitle] = useState('Home')
     const [isAuthenticated, setIsAuthenticated] = useState(false)
     const [isInitialized, setIsInitialized] = useState(false) // Track initialization
     const pathname = usePathname()
     const router = useRouter()

     useEffect(() => {
          // Check if the user is authenticated
          const authToken = localStorage.getItem('authToken')
          setIsAuthenticated(!!authToken)
          setIsInitialized(true) // Mark the initialization complete

          if (!authToken && pathname !== '/signin') {
               // Redirect to the login page if not authenticated
               router.push('/signin')
          }
     }, [pathname, router])

     useEffect(() => {
          // Map pathname to navbar titles
          const routeToTitle: { [key: string]: string } = {
               '/': 'Home',
               '/product': 'Product',
          }

          // Update the title based on current pathname
          setNavbarTitle(routeToTitle[pathname] || 'Unknown Page')
     }, [pathname])

     // Prevent rendering until initialization is complete
     if (!isInitialized) {
          return null
     }

     return (
          <html lang="en" data-theme="light">
               <body>
                    <div>
                         {isAuthenticated ? (
                              <>
                                   <header></header>
                                   <div className="drawer">
                                        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                                        <div className="drawer-content flex flex-col">
                                             {/* Navbar */}
                                             <div className="navbar bg-base-300 w-full">
                                                  <div className="flex-none">
                                                       <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current">
                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                                            </svg>
                                                       </label>
                                                  </div>
                                                  <div className="mx-2 flex-1 px-2">{navbarTitle}</div>
                                                  <div className="flex-none lg:block">
                                                       <ul className="menu menu-horizontal">
                                                            <li>
                                                                 <a
                                                                      onClick={() => {
                                                                           localStorage.removeItem('authToken')
                                                                           router.push('/signin')
                                                                      }}
                                                                 >
                                                                      LOGOUT
                                                                 </a>
                                                            </li>
                                                       </ul>
                                                  </div>
                                             </div>
                                             {children}
                                        </div>
                                        <div className="drawer-side">
                                             <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                                             <ul className="menu bg-base-200 min-h-full w-80 p-4">
                                                  <li>
                                                       <a href="/">Home</a>
                                                  </li>
                                                  <li>
                                                       <a href="/product">Product</a>
                                                  </li>
                                             </ul>
                                        </div>
                                   </div>
                              </>
                         ) : (
                              pathname === '/signin' && (
                                   // Render only the children for the signin page
                                   <div className="flex items-center justify-center min-h-screen">{children}</div>
                              )
                         )}
                    </div>
                    <footer>
                         <p>© 2025 My App</p>
                    </footer>
               </body>
          </html>
     )
}
