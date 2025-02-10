'use client'

import * as React from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

export function NavHead({
     teams,
}: {
     teams: {
          name: string
          logo: React.ElementType
          plan: string
     }[]
}) {
     const [activeTeam, setActiveTeam] = React.useState(teams[0])

     return (
          <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
               <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <activeTeam.logo className="size-4" />
               </div>
               <div className="grid flex-1 text-left text-sm leading-tight">
                    <a href="/">
                         <span className="truncate font-semibold">{activeTeam.name}</span>
                    </a>
               </div>
          </SidebarMenuButton>
     )
}
