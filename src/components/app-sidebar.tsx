'use client'

import * as React from 'react'
import { GalleryVerticalEnd, SquareTerminal } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavFooter } from '@/components/nav-footer'
import { NavHead } from '@/components/nav-header'
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
     ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
