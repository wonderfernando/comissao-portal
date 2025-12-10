
import { ReactNode } from "react";
import { ListMenuItem } from "../components/ListMenu";
 
export interface MenuItem {
    label: string;
    link: string;
    key: number;
}

const menu: MenuItem[] = [
    {
        label: "Detalhes",
        link: "/",
        key: 1
    },
 
    {
        label: "Documentos",
        link: "documentos",
        key: 2
    },
     {
        label: "Membros",
        link: "membros",
        key: 3
    },
 /*    {
        label: "Utilizadores",
        link: "/utilizadores"
    }, */
]
export default async function Layout({ children }: { children: ReactNode }) {

    return (
        <div className="container mx-auto pb-8 space-y-6 mt-4">
            <ListMenuItem menu={menu} />
            <section>
                {children}
            </section>
        </div>
    )
}