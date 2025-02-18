'use client'

import * as React from 'react'
import { useMediaQuery } from '@/lib/use-media-query'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { GalleryVerticalEnd, SquareTerminal } from 'lucide-react'

import { NavMain } from '@/components/sidebar/nav-main'
import { NavFooter } from '@/components/sidebar/nav-footer'
import { NavHead } from '@/components/sidebar/nav-header'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'

// This is sample data.
const data = {
     footer: {
          name: 'Logout',
     },
     teams: [
          {
               name: 'Navigation',
               logo: GalleryVerticalEnd,
               plan: 'Enterprise',
          },
     ],
     navMain: [
          {
               title: 'Dashboard',
               url: '/',
               icon: SquareTerminal,
               isActive: true,
          },
          {
               title: 'Product',
               url: '/product',
               icon: SquareTerminal,
               isActive: true,
          },
          {
               title: 'Item',
               url: '/item',
               icon: SquareTerminal,
               isActive: true,
          },
          {
               title: 'Carousel',
               url: '/carousel',
               icon: SquareTerminal,
               isActive: true,
          },
          {
               title: 'Main Product',
               url: '/mainproduct',
               icon: SquareTerminal,
               isActive: true,
          },
          {
               title: 'Image',
               url: '/image',
               icon: SquareTerminal,
               isActive: true,
          },
     ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
     const isMobile = useMediaQuery('(max-width: 900px)')
     const [open, setOpen] = React.useState(false)

     if (isMobile) {
          return (
               <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                         <button onClick={() => setOpen(true)} className="fixed top-4 left-4 z-50 text-black p-2 rounded-md">
                              ☰
                         </button>
                    </SheetTrigger>
                    {/* ✅ Fix: Add SheetTitle for accessibility */}
                    <SheetContent side="left" className="w-[--sidebar-width] bg-sidebar">
                         <SheetTitle></SheetTitle>
                         <SheetDescription></SheetDescription>

                         <NavHead teams={data.teams} />
                         <NavMain items={data.navMain} />
                         <NavFooter footer={data.footer.name} />
                    </SheetContent>
               </Sheet>
          )
     }

     return (
          <Sidebar collapsible="icon" {...props}>
               <SidebarHeader>
                    <NavHead teams={data.teams} />
               </SidebarHeader>
               <SidebarContent>
                    <NavMain items={data.navMain}></NavMain>
               </SidebarContent>
               <SidebarFooter>
                    <NavFooter footer={data.footer.name} />
               </SidebarFooter>
               <SidebarRail />
          </Sidebar>
     )
}
