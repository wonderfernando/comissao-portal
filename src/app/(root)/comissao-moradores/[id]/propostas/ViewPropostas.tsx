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
import TablePropostas from "../components/table-projects"
import { Input } from "@/components/ui/input"
import { DropDownFilterEntity } from "../../components/dropdown-filter"

const comissao = {
  nome: "Comissão Central",
  localizacao: "Luanda",
  delimitacao_geografica: "Zona Sul",
  contactos: "9376****",
  bairro_id: 12,
  email: "comissao@email.com",
  imagem: "/profile.jpg",
  documentos: [
    "Termo de Posse",
    "Mapa de Delimitação",
    "Comprovativo de Endereço",
  ],
}

export function PropostasComissaoView() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col w-full items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full">
          <div>
            <CardTitle className="text-xl">Propostas de Projecto da {comissao.nome}</CardTitle>
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