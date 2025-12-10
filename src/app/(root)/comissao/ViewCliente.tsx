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
import { useState, useTransition } from "react"
import { retStatusComissao } from "../comissao-moradores/utils"
import { Comissao } from "../comissao-moradores/interface"
 


export function ComissaoProfileView({ comissao }: { comissao: Comissao | null }) {

  const [openStatus, setOpenStatus] = useState(false);
  const [valueStatus, setStatus] = useState('');
  
 

  
  console.log(comissao)
  function changeStatus(status: string) {
    setStatus(status);
    setOpenStatus(true);
  }
const[isPending, startTransition] = useTransition()
  async function onClickEmitir() {
    startTransition(() => {
       window.open(`/api/certificado/${comissao?.id}`, "_blank")
    })
  }

 
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <CardTitle className="text-xl">{comissao?.nome}</CardTitle>
            <Badge variant="outline">Comissão</Badge>
          </div>
        </div>
       
      </CardHeader>

      <Separator className="my-4" />

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="font-semibold">Localização</Label>
          <p>{comissao?.localizacao}</p>
        </div>

        <div>
          <Label className="font-semibold">Delimitação Geográfica</Label>
          <p>{comissao?.delimitacao_geografica}</p>
        </div>

        <div>
          <Label className="font-semibold">Contacto</Label>
          <p>{comissao?.contacto}</p>
        </div>

        <div>
          <Label className="font-semibold">Email</Label>
          <p>{comissao?.email}</p>
        </div>


        <div>
          <Label className="font-semibold">Provincia</Label>
          <p>{comissao?.bairro?.comuna.municipio.provincia.nome}</p>
        </div>
        <div>
          <Label className="font-semibold">Município</Label>
          <p>{comissao?.bairro?.comuna.municipio.nome}</p>
        </div>
        <div>
          <Label className="font-semibold">Distrito</Label>
          <p>{comissao?.bairro?.comuna?.nome}</p>
        </div>
        <div>
          <Label className="font-semibold">Bairro</Label>
          <p>{comissao?.bairro?.nome}</p>
        </div>


      </CardContent>

      {/*    <Separator className="my-6" />

      <CardContent>
        <Label className="font-semibold mb-2 block">📁 Documentos Associados</Label>
        <ul className="space-y-2">
          {comissao?.documento.map((doc, index) => (
            <li key={index} className="flex items-center justify-between border rounded px-4 py-2">
              <span>{doc.nome}</span>
              <Badge variant="secondary">Visualizar</Badge>
            </li>
          ))}
        </ul>
      </CardContent> */}
      <Separator className="my-6" />
      <CardContent>
         <Label className="font-semibold mb-2 block">⚙️ Estado do CM {retStatusComissao(comissao?.status || "inativo")}</Label>
      </CardContent>
    </Card>
  )
}