"use client";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { logoutAction } from "../auth";
import { useTransition } from "react";
import { useTopLoader } from "nextjs-toploader";

export function SideBarMenuItemLogout() {
    const [_, startTransition] = useTransition();
    const topLoader = useTopLoader();
    async function logout() {
        startTransition(async () => {
            topLoader.start();
           await logoutAction();
            topLoader.done();
        });
    }
    return (
        <SidebarMenuButton onClick={logout} size="sm" className="text-sm font-semibold 
            cursor-pointer
        " asChild>
            <span>Sair</span>
        </SidebarMenuButton>
    )
}