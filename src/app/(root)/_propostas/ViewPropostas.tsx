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
import {  Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropDownFilterEntity } from "../comissao-moradores/components/dropdown-filter"
import TablePropostas from "../comissao-moradores/[id]/components/table-projects"


export function PropostasComissaoView() {
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
          <Button variant={"outline"}>Exportar <Download /></Button>
        </div>
         </div>
      </CardHeader>

      <Separator className="my-0" />

      <CardContent className="">
         <TablePropostas />
      </CardContent>
    
    </Card>
  )
}