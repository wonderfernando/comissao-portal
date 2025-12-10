
import { ReactNode } from "react";
import { ListMenuItem } from "../../components/ListMenu";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
        label: "Projectos",
        link: "propostas",
        key: 2
    },
    {
        label: "Relatório",
        link: "relatorio-financeiro",
        key: 3
    },
]

export default async function Layout({ children }: { children: ReactNode }) {

    return (
        <div className="container mx-auto pb-8 space-y-6 mt-4">
            <div className="">
                <Link className="flex items-center gap-2 hover:underline" href={"/forum-prestacao-contas"}> <ArrowLeft size={14}/> Voltar</Link>
            </div>
            <ListMenuItem menu={menu} />
            <section>
                {children}
            </section>
        </div>
    )
}