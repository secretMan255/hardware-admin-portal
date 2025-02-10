'use client'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { useRouter } from 'next/navigation'

export function NavFooter({ footer }: { footer: string }) {
     const router = useRouter()

     function removeCookie() {
          if (typeof document !== 'undefined') {
               // Ensure the code runs client-side
               document.cookie = 'authToken=; Max-Age=0; path=/'
          }

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
