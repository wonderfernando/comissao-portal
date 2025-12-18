
import { Banknote, Building, Building2, Building2Icon, Calendar, CalendarArrowDown, Factory, Files, GoalIcon, Home, Megaphone, MegaphoneOff, PhoneMissed, Speaker, UserRoundCog, Users2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar"
import { SideBarMenuCustom, TooltipDemo } from "./sidebar-menu-button"
import Link from "next/link"
import { SideBarMenuItemLogout } from "./logout-menu-item"
import { getCurrentUser } from "../auth"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { CollapsibleTrigger } from "@radix-ui/react-collapsible"

// Menu items.
export const items_ = [
/*   {
    title: "Início",
    url: "/",
    icon: Home,
  }, */

  {
    title: "Minha Comissão",
    url: "/comissao",
    icon: Building2,
  },
  {
    title: "Emissão de Documentos",
    url: "/emissao-documentos",
    icon: Files,
  },
]
 
export async function AppSidebar() {
      return (
    <Sidebar variant="floating" className="w-2xs text-muted-foreground">
      <SidebarHeader>
        <SidebarMenuButton size="lg" className="text-[16px] font-bold" asChild>
          <a href="#" className="grid items-center gap-2">
            <img src="/logo2.png" width={80} height={80} alt="Logo" className="rounded-md inline-block mr-2" />
            <span className="text-xs">Portal de Participação Cidadão.</span>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>Resumo</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu >
              <Collapsible  className="group/collapsible">

                {items_.map((item) => (
                  <SideBarMenuCustom key={item.url} title={item.title} url={item.url} >
                    <Link href={item.url}>
                      {<item.icon />}
                     {(item.url === "/forum-prestacao-contas" || item.url === "/forum-recolha-contribuicao")
                     ? <TooltipDemo title={item.title} description={item.title} />
                     : <span>{item.title}</span>
                     }
                     
                    </Link>
                  </SideBarMenuCustom>
                ))}
        

              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>Configurações</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm" className="text-sm font-semibold" asChild>
                  <Link href="/perfil">
                    <span>Perfil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SideBarMenuItemLogout />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}