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
            const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")
            return (
              <BreadcrumbItem key={href}>
                {isLast ? (
                  <BreadcrumbLink href="#">{label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
                {!isLast && <BreadcrumbSeparator> / </BreadcrumbSeparator>}
              </BreadcrumbItem>
            )
          })
        }
      
      </BreadcrumbList>
    </Breadcrumb>
  )
}
