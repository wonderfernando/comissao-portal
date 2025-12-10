import { SidebarProvider } from "@/components/ui/sidebar"

import { Children } from "./interface"
import { AppSidebar } from "./components/sidebar"
import { Header } from "./components/header"
import Footer from "./components/footer"


export default function Layout({ children }: Children) {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "18rem",
        "--sidebar-collapsed-width": "4rem",
      } as React.CSSProperties}
      className="min-h-screen">
      <AppSidebar />
      <main className="gap-2 w-full flex flex-col overflow-y-auto ">
        <Header />
        {children}
        <Footer />
      </main>
    </SidebarProvider>
  )
}
