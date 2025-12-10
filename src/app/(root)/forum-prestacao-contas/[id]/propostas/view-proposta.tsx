"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Forum } from "../../interface"
import { useParams } from "next/navigation"
import { SubmitRelatorioDialog } from "./componentes/dialog-save-proposta"


 

 

/* function statePriority(state: string) {
  switch (state) {
    case "baixa":
      return <Badge variant="outline" className="border-green-600" color="#000">Baixa</Badge>;
    case "media":
      return <Badge variant="outline" className=" border-amber-600" color="#000">Média</Badge>;
    case "alta":
      return <Badge variant="outline" className=" border-red-600" color="#000">Alta</Badge>;
    default:
      return "unknown";
  }
}
 */
export default function ForumPrestacao({ dados }: { dados: Forum }) {
 
  console.log("Forum ID:", dados);
  return (
    <div className="mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Projectos</CardTitle>
          <p className="text-sm text-muted-foreground">
            Local: {dados.local} • Município: {dados.municipio.nome}
          </p>
          <p className="text-sm text-muted-foreground">
            Período: {new Date(dados.data_inicio).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })} até {new Date(dados.data_fim).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
          </p>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Projectos em Carteira</h3>
          {dados.forun_prestacao_contas.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma contribuição registrada.</p>
          ) : (
            <div className="space-y-4 mb-6">
              {dados.forun_prestacao_contas.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className=" text-muted-foreground">
                      Criado em {new Date(item.created_at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <p className="font-semibold text-sm text-zinc-400">Descrição do Projecto:</p>
                  <p className="text-sm mb-2">{item?.projeto?.titulo}</p>
                  <Separator className="my-2" />
                  <p className="font-semibold text-sm  text-zinc-400">Submetido por:</p>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground font-semibold">{dados.criado_por.nome}</p>
                      <p className="text-sm text-muted-foreground">{dados.criado_por.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <SubmitRelatorioDialog id={dados.id.toString()} />
        </CardContent>
      </Card>
    </div>
  )
}
