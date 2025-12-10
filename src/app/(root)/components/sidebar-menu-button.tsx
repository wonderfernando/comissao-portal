"use client"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
 
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function SideBarMenuCustom({ children, url, title }: {url: string, children?: React.ReactNode, title: string, icon?: React.ComponentType}) {
    
    const pathname = usePathname()

    const base_url = pathname.split('/').length > 1 ? `/${pathname.split('/')[1]}` : pathname;

    let isActive = (base_url == `${url}`);
    console.log(base_url)
    
    if (pathname === "/" && url === "/") {
        isActive = true
    }
return (
        <SidebarMenuItem className="">
            <SidebarMenuButton tooltip={"kjas"}  className={`hover:bg-red-900 hover:text-zinc-50  ${isActive ? "bg-red-900 text-zinc-50 " : ""} text-sm font-semibold`} asChild>
                {children}
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}



export function TooltipDemo({description,title }: {description: string, title: string}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>{title}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  )
}
