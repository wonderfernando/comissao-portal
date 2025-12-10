import { ReactNode } from "react";
import { ListMenuItem } from "../components/ListMenu";

export interface MenuItem {
    label: string;
    link: string;
    key: number;
}

const menu: MenuItem[] = [
    {
        label: "Início",
        link: "emissao-documentos",
        key: 1
    },
    {
        label: "Declaração de Morador",
        link: "declaracao-morador",
        key: 2
    },
    {
        label: "Morador Menor",
        link: "declaracao-morador-menor",
        key: 3
    },
    {
        label: "Ocorrência de Óbito",
        link: "ocorrencia-obito",
        key: 4
    },
    {
        label: "Declaração de Ocorrência",
        link: "declaracao-ocorrencia",
        key: 5
    },
];

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="container mx-auto pb-8 space-y-6 mt-4 px-4">
            <ListMenuItem menu={menu} />
            <section>
                {children}
            </section>
        </div>
    );
}
