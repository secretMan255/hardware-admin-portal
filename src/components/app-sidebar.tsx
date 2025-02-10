'use client'

import * as React from 'react'
import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, Map, PieChart, Settings2, SquareTerminal } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { NavHead } from '@/components/nav-header'
import {
     Sidebar,
     SidebarContent,
     SidebarFooter,
     SidebarGroup,
     SidebarGroupContent,
     SidebarGroupLabel,
     SidebarHeader,
     SidebarMenu,
     SidebarMenuButton,
     SidebarMenuItem,
     SidebarRail,
} from '@/components/ui/sidebar'

// This is sample data.
const data = {
     footer: {
          name: 'shadcn',
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
                    <NavUser footer={data.footer.name} />
               </SidebarFooter>
               <SidebarRail />
          </Sidebar>
     )
}
