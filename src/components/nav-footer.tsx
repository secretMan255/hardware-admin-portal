'use client'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { useRouter } from 'next/navigation'
import { CallApi } from '@/axios/call-api'

export function NavFooter({ footer }: { footer: string }) {
     const router = useRouter()

     async function removeCookie() {
          await CallApi.logout()

          router.push('/login')
     }

     return (
          <SidebarMenu>
               <SidebarMenuItem onClick={removeCookie}>
                    <SidebarMenuButton>
                         <span>Logout</span>
                    </SidebarMenuButton>
               </SidebarMenuItem>
          </SidebarMenu>
     )
}
