'use client'

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Projeto } from "./interface"
import { DropDownFilterEntity } from "../comissao-moradores/components/dropdown-filter"
import { DialogProjeto } from "./componentes/projeto/DialogProjeto"
import TableProjectos from "./componentes/table-projects"
import { BtnPrint } from "../components/btn-print"


export function ProjectosView({ projetos }: { projetos: Projeto[] }) {
    console.log(projetos)
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col w-full items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full">
                    <div>
                        <CardTitle className="text-xl">Projectos Aprovados</CardTitle>
                        <Badge variant="outline">Projectos</Badge>
                    </div>
                </div>
                <div className="w-full flex justify-between">
                    <div className="flex items-center mb-4">
                        <Input placeholder="Buscar projecto..." className="mr-2" />
                        <div>
                            <DropDownFilterEntity />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <BtnPrint url="imprimir/projeto" />
                        {/*  <DialogProjeto /> */}
                    </div>
                </div>
            </CardHeader>


            <Separator className="my-0" />
            <CardContent className="">
                <TableProjectos projetos={projetos} />
            </CardContent>

        </Card>
    )
}
