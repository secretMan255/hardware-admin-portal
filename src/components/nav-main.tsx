'use client'
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function NavMain({
     items,
}: {
     items: {
          title: string
          url: string
          icon: React.ComponentType
          isActive: boolean
     }[]
}) {
     return (
          <SidebarGroup>
               <SidebarGroupLabel>List</SidebarGroupLabel>
               <SidebarGroupContent>
                    <SidebarMenu>
                         {items.map((item) => (
                              <SidebarMenuItem key={item.title}>
                                   <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                             <item.icon />
                                             <span>{item.title}</span>
                                        </a>
                                   </SidebarMenuButton>
                              </SidebarMenuItem>
                         ))}
                    </SidebarMenu>
               </SidebarGroupContent>
          </SidebarGroup>
     )
}
