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
import { Download, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const centro = {
  titulo: "Centro Comunitário",
  descricao: "Espaço multiuso para reuniões e eventos.",
  custo: "12.000.000 Kz",
  localizacao: "Palanca, Luanda",
  estado: "execução",
  dataCriacao: "2025-01-15",
  dataTermino: "2025-12-20",
  anexos: ["Planta", "Orçamento", "Fotos"],
}

export function PropostaView() {
  const handleAcao = (acao: string) => {
    // Aqui você pode integrar com API ou lógica de estado
    console.log(`Ação selecionada: ${acao}`)
    alert(`Projeto marcado como: ${acao}`)
  }
  const router = useRouter();

  return (
    <Card className="w-full">
      {/* Cabeçalho */}
      <CardHeader className="flex items-center justify-between gap-4">
        <div>
          <Button onClick={() => {router.back()}} variant={"link"}><ChevronLeft className="mr-2" /> Voltar</Button>
          <CardTitle className="text-xl">{centro.titulo}</CardTitle>
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
          <p>{centro.descricao}</p>
        </div>

        <div>
          <Label className="font-semibold">Localização</Label>
          <p>{centro.localizacao}</p>
        </div>

        <div>
          <Label className="font-semibold">Custo</Label>
          <p>{centro.custo}</p>
        </div>

        <div>
          <Label className="font-semibold">Estado</Label>
          <Badge variant="secondary" className="capitalize">{centro.estado}</Badge>
        </div>

        <div>
          <Label className="font-semibold">Data de Criação</Label>
          <p>{centro.dataCriacao}</p>
        </div>

        <div>
          <Label className="font-semibold">Data de Término</Label>
          <p>{centro.dataTermino}</p>
        </div>
      </CardContent>

      <Separator className="my-6" />

      {/* Anexos */}
      <CardContent>
        <Label className="font-semibold mb-2 block">📎 Anexos</Label>
        <ul className="space-y-2">
          {centro.anexos.map((anexo, index) => (
            <li key={index} className="flex items-center justify-between border rounded px-4 py-2">
              <span>{anexo}</span>
              <Badge variant="secondary">Visualizar</Badge>
            </li>
          ))}
        </ul>
      </CardContent>

      <Separator className="my-6" />

      {/* Botão de Ações */}
      <CardContent>
        <Label className="font-semibold mb-2 block">⚙️ Estado do Projecto <Badge variant="secondary" color="default" className="capitalize bg-green-700 text-white">{centro.estado}</Badge></Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default">Modificar</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleAcao("Aprovado")}>✅ Executar</DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleAcao("Aprovado")}>✅ Aprovar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAcao("Cancelado")}>❌ Cancelar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAcao("Devolvido")}>📤 Devolver</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAcao("Pausado")}>⏸️ Pausar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAcao("Finalizado")}>🏁 Finalizar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>

      <Separator className="my-6" />
 
    </Card>
  )
}
