'use client'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2, Plus, X } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
const documents = [
  {
    nome: "",
    tipo: "Acta constitutiva",
    tamanho: "",
    criado: "",
  },
  {
    nome: "",
    tipo: "Estatutos",
    tamanho: "",
    criado: "",
  },
  {
    nome: "",
    tipo: "Lista de membros",
    tamanho: "",
    criado: "",
  },
]

export function DocumentUploadPage() {


  return (
    <div className="flex-1 p-4 overflow-hidden">
      <div className="mb-4">
        <h1>📁 Documentos Necessários</h1>
      </div>

      <div className="space-y-6">
        {documents.map((doc, index) => (
          <LineItem key={index} doc={doc} />
        ))}
        <Separator />
      </div>
    </div>
  )
}


function LineItem({ doc }: { doc: (typeof documents)[0] }) {

  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    })

  const { mutateAsync: uploadFile, isPending } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const formData = new FormData()
      formData.append("documento", file)
      formData.append("descricao", doc.tipo)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        throw new Error("Erro ao fazer upload do arquivo")
      }
      const data = await response.json()
      console.log(data)
      return data
    },
  })
  useEffect(() => {

    if (files.length > 0 && files[0].file instanceof File) {
      uploadFile({ file: files[0].file })
    }
  }, [files])

  const fileName = files[0]?.file.name || null
  const size = files[0]?.file.size || null
  const fileSizeInKB = size ? Math.round(size / 1024) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
      <Label className="text-muted-foreground">{doc.tipo}</Label>
      <Label className="font-medium">{fileName?.substring(0, 15)}...</Label>
      <Label className="text-muted-foreground">{Math.round(fileSizeInKB / 1024)} MB</Label>

      <div className="flex gap-2">
        <div className="relative inline-block">
          <Button disabled={isPending} onClick={openFileDialog} size="sm" variant={"outline"}>{isPending && <Loader2 className="animate-spin" />} <Plus /></Button>
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
            tabIndex={-1}
          />
        </div>
        <Button disabled={!files[0]} onClick={() => removeFile(files[0].id)} size="sm" variant={"outline"}><X /></Button>
      </div>
    </div>
  )
}