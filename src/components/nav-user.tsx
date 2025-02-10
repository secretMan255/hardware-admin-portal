'use client'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function NavUser({ footer }: { footer: string }) {
     return (
          <SidebarMenu>
               <SidebarMenuItem>
                    <SidebarMenuButton>{footer}</SidebarMenuButton>
               </SidebarMenuItem>
          </SidebarMenu>
     )
}
