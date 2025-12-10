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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Download, ChevronLeft, Loader2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { postStatePropostaAction } from "../../actions"
import { Proposta } from "../interface"
import { toast } from "sonner"


export function PropostaView({ proposta }: { proposta: Proposta }) {

  const id = useParams().propostId;
  const { mutateAsync: updateState, isPending: isLoading } = useMutation({
    mutationFn: postStatePropostaAction,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.message)
        return
      }
      toast.success("Estado da proposta atualizado com sucesso")
    },
    onError: (error) => {
      console.error("Erro ao atualizar o estado da proposta:", error);
    }
  })
  const handleAcao = async (acao: string) => {
    await updateState({ state: acao, id: Number(id) });
  }
  const router = useRouter();

  return (
    <Card className="w-full">
      {/* Cabeçalho */}
      <CardHeader className="flex items-center justify-between gap-4">
        <div>
          <Button onClick={() => { router.back() }} variant={"link"}><ChevronLeft className="mr-2" /> Voltar</Button>
          <CardTitle className="text-xl">{proposta?.titulo}</CardTitle>
          <Badge variant="outline">Projeto</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Exportar <Download className="ml-2 h-4 w-4" /></Button>

        </div>
      </CardHeader>

      <Separator className="my-4" />

      {/* Dados principais */}
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="font-semibold">Descrição</Label>
          <p>{proposta?.descricao}</p>
        </div>

        <div>
          <Label className="font-semibold">Localização</Label>
          <p>{proposta?.localizacao}</p>
        </div>

        <div>
          <Label className="font-semibold">Custo</Label>
          <p>{proposta?.custo_estimado}</p>
        </div>

        <div>
          <Label className="font-semibold">Estado</Label>
          <Badge variant="secondary" className="capitalize">{proposta?.estado.nome}</Badge>
        </div>

        <div>
          <Label className="font-semibold">Data de Criação</Label>
          <p>{new Date(proposta?.created_at).toLocaleString("pt-PT", 
            {
              day: "2-digit",
              month:"2-digit",
              year:"numeric"
            }
          )}</p>
        </div>

      </CardContent>

      <Separator className="my-6" />

      {/* Anexos */}
      <CardContent>
        <Label className="font-semibold mb-2 block">📎 Anexos</Label>
        <ul className="space-y-2">
          {proposta?.anexos.map((anexo, index) => (
            <li key={index} className="flex items-center justify-between border rounded px-4 py-2">
              <span>{anexo.nome}</span>
              <a
                href={anexo.url_ficheiro}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline text-blue-600"
              >
                Visualizar
              </a>
            </li>
          ))}
        </ul>
      </CardContent>

      <Separator className="my-6" />

      {/* Botão de Ações */}
      {
        proposta?.estado.id === 1 && (
           <CardContent>
        <Label className="font-semibold mb-2 block">⚙️ Estado do Projecto <Badge variant="secondary" color="default" className="capitalize bg-green-700 text-white">{proposta?.estado.nome}</Badge></Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default">Modificar</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>

            <DropdownMenuItem onSelect={(e) => e.preventDefault()} disabled={isLoading} onClick={() => handleAcao("aprovar")}>Aprovar  {isLoading && <Loader2 className="animate-spin" />}</DropdownMenuItem>
            <DropdownMenuItem disabled={isLoading} onSelect={(e) => e.preventDefault()} onClick={() => handleAcao("rejeitar")}>Rejeitar  {isLoading && <Loader2 className="animate-spin" />}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
        )
      }
     

      <Separator className="my-6" />

    </Card>
  )
}
