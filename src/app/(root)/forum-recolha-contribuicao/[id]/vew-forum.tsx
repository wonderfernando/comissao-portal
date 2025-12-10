'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { AlertTriangle,  Users2 } from "lucide-react"
import {  Forum } from "../interface"
 
 

interface ForumViewProfileProps {
  forum: Forum | null;
}

export function ForumViewProfile({forum}: ForumViewProfileProps) {
console.log("Forum ", forum)
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <CardTitle className="text-xl">{forum?.titulo}</CardTitle>
            <Badge variant="outline">Fórum de Recolha de Contribuições</Badge>
          </div>
        </div>
       {/*  <div className="flex gap-2">
          <Button variant={"outline"}>Exportar <Download /></Button>
          <Link href={"/comissoes/edit"}>
            <Button>Editar</Button>
          </Link>
        </div> */}
      </CardHeader>

      <Separator className="my-4" />

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="font-semibold">Data de início</Label>
          <p>{forum?.data_inicio}</p>
        </div>

        <div>
          <Label className="font-semibold">Data de fim</Label>
          <p>{forum?.data_fim}</p>
        </div>

        <div>
          <Label className="font-semibold">Localização</Label>
          <p>{forum?.local}</p>
        </div>
      </CardContent>

      <Separator className="my-6" />

      <CardContent>
        <Label className="font-semibold mb-2  flex gap-2"><Users2 size={14}/> Participantes</Label>
        <ul className="space-y-2">
          {forum?.participantes?.map((participante, index) => (
            <li key={index} className="flex items-center justify-start border rounded px-4 py-2 gap-2">
              <div>
                <p className="font-semibold">{participante?.nome}</p>
                <p className="text-sm text-muted-foreground">{participante?.papel}</p>
              </div>
            
            </li>
          ))}
        </ul>
      </CardContent>
  <Separator className="my-6" />
 

      <div className="mx-4 my-8 p-4 grid items-start justify-start bg-red-800/30 rounded-lg border-2 border-red-900">
        <div>
          <span className="flex font-bold gap-2"><AlertTriangle /> Excluir Forum</span>
          <span>Todos os registros relacionados a este Forum serão removidos</span>
        </div>
        <div>
          <Button className="bg-red-900 hover:bg-red-800" size="sm">
            Excluir Forum
          </Button>
        </div>
      </div>
    </Card>
  )
}