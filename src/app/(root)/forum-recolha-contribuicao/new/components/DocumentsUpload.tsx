'use client'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus, X } from "lucide-react"

const documents = [
  {
    nome: "identidade.pdf",
    tipo: "Bilhete de Identidade",
    tamanho: "1.2 MB",
    criado: "08/09/2025",
  },
  {
    nome: "residencia.jpg",
    tipo: "Comprovativo de Residência",
    tamanho: "850 KB",
    criado: "07/09/2025",
  },
  {
    nome: "rendimentos.docx",
    tipo: "Declaração de Rendimentos",
    tamanho: "2.4 MB",
    criado: "06/09/2025",
  },
]

export  function DocumentUploadPage() {
  return (
    <div >
      <div className="mb-4">
        <h1>📁 Documentos Necessários</h1>
      </div>

      <div className="space-y-6">
        {documents.map((doc, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
            <Label className="text-muted-foreground">{doc.tipo}</Label>
            <Label className="font-medium">{doc.nome} </Label>
            <Label className="text-muted-foreground">{doc.tamanho}</Label>
            <Label className="text-muted-foreground">{doc.criado}</Label>
            <div className="flex gap-2">
                <Button size="sm" variant={"outline"}><Plus /></Button>
                <Button size="sm" variant={"outline"}><X /></Button>
            </div>
          </div>
        ))}
        <Separator />
      </div>
    </div>
  )
}
