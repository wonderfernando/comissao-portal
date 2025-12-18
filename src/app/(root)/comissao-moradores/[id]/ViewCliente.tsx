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
import { AlertTriangle, Download, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import AlertComponent from "../../components/alert-sure"
import { Comissao } from "../interface"
import { retStatusComissao } from "../utils"
import { UseMutationOptions, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateStateComissaoMoradores } from "../actions"
import { getCurrentUser } from "../../auth"
import { CertificadoComissaoForm } from "./certificado-form"



export function ComissaoProfileView({ comissao }: { comissao: Comissao | null }) {

  const [openStatus, setOpenStatus] = useState(false);
  const [valueStatus, setStatus] = useState('');

  const configMutationStateComissao: UseMutationOptions<
    { success: boolean; message: string },
    Error,
    { state: string; id: string }
  > = {
    mutationFn: updateStateComissaoMoradores,
    onSuccess: (data: any) => {
      console.log("Comissão atualizada com sucesso:", data);
      if (!data.success) {
        toast.error(data?.mensagem || "Erro ao salvar comissão.");
        return;
      }
      setOpenStatus(false);
      toast.success("Comissão atualizada com sucesso.");
    },
    onError: (error: any) => {
      console.log("Erro ao atualizar comissão:", error);
      toast.error(error.message || "Erro ao atualizar comissão.");
    }
  }

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    enabled: true
  })

  console.log(comissao)
  function changeStatus(status: string) {
    setStatus(status);
    setOpenStatus(true);
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
        <div className="flex gap-2">
          {/*   <Button onClick={renderPdf} variant={"outline"}>Exportar <Download /></Button>
         */}  <Link href={"/comissoes/edit"}>
            <Button>Editar</Button>
          </Link>
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

      {/* Botão de Ações */}
      <CardContent>
        <AlertComponent config={configMutationStateComissao} title="Tem certeza?" description="Você tem certeza que deseja modificar o estado?" open={openStatus} status={valueStatus} onOpenChange={setOpenStatus} comissaoId={comissao?.id?.toString()} />
        <Label className="font-semibold mb-2 block">⚙️ Estado do CM {retStatusComissao(comissao?.status || "inativo")}</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default">Modificar</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => changeStatus("aprovar")}> Aprovar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeStatus("reprovar")}> Reprovar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {(user?.tipo === "admin_municipal" || user?.tipo === "admin_central") && <div className="flex mt-4">
          <CertificadoComissaoForm comissao={comissao} />
        </div>}
      </CardContent>

      <Separator />

      <div className="mx-4 my-8 p-4 grid items-start justify-start bg-red-800/30 rounded-lg border-2 border-red-900">
        <div>
          <span className="flex font-bold gap-2"><AlertTriangle /> Excluir Comissão</span>
          <span>Todos os registros relacionados a esta comissão serão removidos</span>
        </div>
        <div>
          <Button className="bg-red-900 hover:bg-red-800" size="sm">
            Excluir Comissão
          </Button>
        </div>
      </div>
    </Card>
  )
}