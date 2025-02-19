'use client'

import * as React from 'react'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import Link from 'next/link'

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
                    <Link href="/">
                         <span className="truncate font-semibold">{activeTeam.name}</span>
                    </Link>
               </div>
          </SidebarMenuButton>
     )
}
