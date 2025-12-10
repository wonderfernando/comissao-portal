"use client"
import { Children } from "../interface"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutAction } from "../auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import {useTopLoader} from "nextjs-toploader"

export function DropdownMenuProfile({ children }: Children) {
  const [isPending, startTransition] = React.useTransition();
  const [isPendingPerfil, startTransitionPerfil] = React.useTransition();
  const router = useRouter();

  async function logout() {
    startTransition(async () => {
      await logoutAction();
    });
  }
  const topLoader = useTopLoader()
  async function perfil(){
    startTransitionPerfil(async () => {
      topLoader.start();
      router.push('/perfil');
      topLoader.done();
    });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem
        className="flex items-center gap-2 cursor-pointer"
          onSelect={(e) => {
            
            perfil()
          }}
        >
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem
        className="flex items-center gap-2 cursor-pointer"
          onSelect={(e) => {
            e.preventDefault()
            logout()
          }}
          >
            Sair
           {isPending && <Loader2 className="animate-spin"/>}
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}