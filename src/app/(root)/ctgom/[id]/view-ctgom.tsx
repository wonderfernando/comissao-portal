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
import Link from "next/link"
import { AlertTriangle, Download, Users2 } from "lucide-react"
 import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Ctgom } from "../interface"
 
 

interface CtgomViewProfileProps {
  ctgom: Ctgom
}

export function CtgomViewProfile({ctgom}: CtgomViewProfileProps) {

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <CardTitle className="text-xl">{ctgom.nome}</CardTitle>
            <Badge variant="outline">Comité Técnico de Gestão do Orçamento do Município (CTGOM)</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant={"outline"}>Exportar <Download /></Button>
          <Link href={"/comissoes/edit"}>
            <Button>Editar</Button>
          </Link>
        </div>
      </CardHeader>

      <Separator className="my-4" />

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="font-semibold">Província</Label>
          <p>{ctgom.municipio.provincia.nome}</p>
        </div>

        <div>
          <Label className="font-semibold">Municipio</Label>
          <p>{ctgom.municipio.nome}</p>
        </div>

        <div>
          <Label className="font-semibold">Localização</Label>
          <p>{ctgom.localizacao}</p>
        </div>
      </CardContent>

      <Separator className="my-6" />

      <CardContent>
        <Label className="font-semibold mb-2  flex gap-2"><Users2 size={14}/> Membros ativos</Label>
        <ul className="space-y-2">
          {ctgom.mandato.flatMap(m=>m.membros)?.filter(a=>a.ativo === 1).map((membro, index) => (
            <li key={index} className="flex items-center justify-start border rounded px-4 py-2 gap-2">
              <div>
                <Avatar>
                    <AvatarFallback>
                    {membro.user_membro.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="font-medium">{membro.user_membro.nome} - <span className="font-normal">{membro.funcao}</span></p>
                <p className="text-sm text-muted-foreground">{membro.user_membro.telefone} | {membro.user_membro.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
  <Separator className="my-6" />
 

      <div className="mx-4 my-8 p-4 grid items-start justify-start bg-red-800/30 rounded-lg border-2 border-red-900">
        <div>
          <span className="flex font-bold gap-2"><AlertTriangle /> Excluir CTGOM</span>
          <span>Todos os registros relacionados a este CTGOM serão removidos</span>
        </div>
        <div>
          <Button className="bg-red-900 hover:bg-red-800" size="sm">
            Excluir CTGOM
          </Button>
        </div>
      </div>
    </Card>
  )
}