"use client"
import { HomeIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { items_ } from "@/app/(root)/components/sidebar"

export default function BreadcrumbComp() {
  const pathname = usePathname()
  const list = pathname.split("/").filter((path) => path !== "" && isNaN(Number(path)))
  
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="-" className="flex items-center gap-1">
            <HomeIcon size={16} aria-hidden="true" />
            <span className="">Inicio</span> /
          </BreadcrumbLink>
        </BreadcrumbItem>
        {
          list?.map((path, index) => {
            const isLast = index === list.length - 1
            const href = `/${list.slice(0, index + 1).join("/")}`
            const title = items_.find((item) => item.url === href)?.title
            return (
              <BreadcrumbItem key={href}>
                {isLast ? (
                  <BreadcrumbLink href="#">{title}</BreadcrumbLink>
                ) : (
                  <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                )}
                      </BreadcrumbItem>
            )
          })
        }
      
      </BreadcrumbList>
    </Breadcrumb>
  )
}
