import { Children } from "../interface"
 
import * as React from "react"

import {
  DropdownMenu,
 
  DropdownMenuContent,
DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

 
 export function DropdownMenuNotify({ children }: Children) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96">
           <DropdownMenuItem>Lorem ipsum dolor sit amet consectetur...</DropdownMenuItem>
           <DropdownMenuSeparator />
           <DropdownMenuItem>Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit ametm Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, pariatur?...</DropdownMenuItem>
           <DropdownMenuSeparator />
            <DropdownMenuItem>Lorem ipsum dolor sit amet consectetur...</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}