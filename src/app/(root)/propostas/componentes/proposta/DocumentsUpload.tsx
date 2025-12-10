'use client'
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {   Loader2, UploadCloud, X } from "lucide-react"
import {  useFileUpload } from "@/hooks/use-file-upload"
import { useEffect } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"

import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { uploadFilesAction } from "@/app/(root)/actions"
import { PropostaCreateDTO } from "../../proposta-schema"
 

export  function DocumentUploadPage() {
     const {mutateAsync: uploadFile, isPending} = useMutation({
      mutationFn: async ({ file }: { file: File }) => {
        const formData = new FormData()
        formData.append("nome", file)
        const response = await uploadFilesAction(formData)
        console.log(response)
        append({nome: response.upload.nome, tipo: response.upload.tipo || ""} )
        clearFiles()
      },
    })
  const {control} = useFormContext<PropostaCreateDTO>()
  const {fields, append, remove} = useFieldArray({
    control,
    name: "uploads"
  })
const [{ files }, { removeFile, openFileDialog, getInputProps, clearFiles }] =
    useFileUpload({
      accept: "image/*,application/pdf",
    })
   useEffect(  () => {
     async function handleFileUpload(file: File) {
       await  uploadFile({ file })
      }
      if (files.length > 0 && files[0].file instanceof File) {

        //essas linhas so pode ser chamada depois de upload ser feito
       handleFileUpload(files[0].file)
     //    append({titulo: "Acta 001", descricao: "Eleicao para nomeacao da ctgom", fileName: files[0].file.name} )
      }
    }, [files])

  return (
    <div className="flex-1 p-4 overflow-hidden">
      <div className="mb-4">
        <h1>📁 Documentos Necessários</h1>
      </div>

      <div className="space-y-6">
     { fields.map((doc, index) => (<div key={doc.id} className="grid grid-cols-1 md:grid-cols-5 w-full   items-center justify-between gap-4">
        <Label className="text-muted-foreground">Documentos</Label>
        <Link target="_blank" href={files[index]?.preview || ""} className=" text-blue-600 hover:underline">
          visualizar
        </Link>
          <div className="flex-1 w-full col-span-2" >
             <Label>{doc.tipo}</Label>
            </div> 
        <div className="flex gap-2 justify-end">
          <Button onClick={() => {remove(index);  removeFile(files[index]?.id)}} size="sm" variant={"outline"}><X /></Button>
        </div>
      </div>
    ))}
        <Separator />
        <div>
            <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
            tabIndex={-1}
          />
           <Button
           type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => openFileDialog()}
        >
          Adicionar Documento  { isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="ml-2 h-4 w-4" />}
        </Button>
        </div>
      </div>
    </div>
  )
}
