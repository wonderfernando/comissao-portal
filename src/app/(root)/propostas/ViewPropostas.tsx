'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import { Input } from "@/components/ui/input"
import { Proposta } from "./interface"
import { DropDownFilterEntity } from "../comissao-moradores/components/dropdown-filter"
import TablePropostas from "./componentes/table-projects"
import { DialogProposta } from "./componentes/proposta/DialogProposta"
import { BtnPrint } from "../components/btn-print"

export function PropostasView({ propostas, tipo }: { propostas: Proposta[], tipo: string | null }) {
 console.log(propostas)
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col w-full items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full">
          <div>
            <CardTitle className="text-xl">Propostas de Projecto </CardTitle>
            <Badge variant="outline">Projectos</Badge>
          </div>
        </div>
        <div className="w-full flex justify-between">
          <div className="flex items-center mb-4">
            <Input placeholder="Buscar entidade..." className="mr-2" />
            <div>
              <DropDownFilterEntity />
            </div>
          </div>
          <div className="flex gap-2">
            <BtnPrint url="imprimir_proposta" />
           {tipo === "admin_municipal" && <DialogProposta />}
          </div>
        </div>
      </CardHeader>


      <Separator className="my-0" />
      <CardContent className="">
        <TablePropostas propostas={propostas} />
      </CardContent>

    </Card>
  )
}