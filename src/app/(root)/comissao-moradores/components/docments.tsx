"use client"

import {
  AlertCircleIcon,
  DownloadIcon,
  FileTextIcon,
  Plus,
  Trash2Icon,

} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useFieldArray, useFormContext } from "react-hook-form"
import { comissaoSchema } from "../interface"
import z from "zod"
 

export default function DocumentsUpload() {


  const { watch, setValue, formState: { errors } } = useFormContext()
  console.log(errors)
  const type = watch("details.type")
  function removeAllFiles() {
    if (type === "SINGULAR") {
      setValue("documents", {
        bi: { name: "", identificacao: "", typeId: "IDENTIFICACAO" },
        comprovativo: { name: "", identificacao: "", typeId: "COMPROVATIVO" },
        extrato: { name: "", identificacao: "", typeId: "EXTRATO" },
        ficha: { name: "", identificacao: "", typeId: "FICHA" },
        nif: { name: "", identificacao: "", typeId: "NIF" },

      })
    }
    if (type === "UNIPESSOAL") {
      setValue("documents", {
        bi: { name: "", identificacao: "", typeId: "IDENTIFICACAO" },
        certificado: { name: "", identificacao: "", typeId: "CERTIFICADO" },
        certidao: { name: "", identificacao: "", typeId: "CERTIDAO" },
        alvara: { name: "", identificacao: "", typeId: "ALVARA" },
        registo: { name: "", identificacao: "", typeId: "REGISTO" },
        extrato: { name: "", identificacao: "", typeId: "EXTRATO" },
        ficha: { name: "", identificacao: "", typeId: "FICHA" },
        nif: { name: "", identificacao: "", typeId: "NIF" },
        fluxo: { name: "", identificacao: "", typeId: "FLUXO_CAIXA" },
      })
    }
    if (type === "COLETIVO") {
      setValue("documents", {
        alvara: { name: "", identificacao: "", typeId: "ALVARA" },
        registo: { name: "", identificacao: "", typeId: "REGISTO" },
        ficha: { name: "", identificacao: "", typeId: "FICHA" },
        fluxo: { name: "", identificacao: "", typeId: "FLUXO" },
        nif: { name: "", identificacao: "", typeId: "NIF" },
      })
    }
  }
  const {append, fields, remove} = useFieldArray<z.infer<typeof comissaoSchema>>({
    name: "uploads", 
  })
  return (
    <div className="flex flex-col gap-2 w-full">
      <>
         <div className="flex items-center justify-between gap-2">
       
          <div className="flex gap-2">
            <Button
              variant="outline" size="sm" onClick={removeAllFiles}>
              <Trash2Icon
                className="-ms-0.5 size-3.5 opacity-60"
                aria-hidden="true"
              />
              Remover todos
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border bg-background">
          <Table>
            <TableHeader className="text-xs">
              <TableRow className="bg-muted/50">
                <TableHead className="h-9 py-2">Name</TableHead>
                <TableHead className="h-9 py-2">Tipo</TableHead>
                <TableHead className="h-9 w-0 py-2 text-right">
                  Acção
                </TableHead>
              </TableRow>
            </TableHeader>
          <Docs files={fields} />
          </Table>
        </div>

        <Button
          variant="link"
          className="w-fit"
          onClick={() => append({ nome: 'Carregar Documento', tipo: '' })}
        >
          <Plus/> Adicionar Documento
        </Button>
      </>
    </div>
  )
}

function Docs({ files }: { files: { nome: string, tipo: string }[] }) {
   
 

  const { watch, setValue } = useFormContext()
  const {remove} = useFieldArray<z.infer<typeof comissaoSchema>>({
    name: "uploads",
  })
 
 
 
  return (
    <TableBody className="text-[13px]">
      {
        files.map((file, index) => (
          <TableRow key={`${file.nome}-${index}`} >
            <TableCell className="max-w-48 py-2 font-medium">
              <Button
                variant="outline"
              >
                <span className="flex items-center gap-2">
                  <span className="shrink-0"> <FileTextIcon className="size-4 opacity-60" /></span>
                  <span className="truncate">{watch(`uploads.${index}.nome`)}</span>
                </span>
              </Button>
            </TableCell>

            <TableCell className="py-2 text-muted-foreground">
              {String(watch(`uploads.${index}.tipo`) ?? "") || "-"}
            </TableCell>
     
            <TableCell className="py-2 text-right whitespace-nowrap">
              <Button
                disabled={watch(`uploads.${index}.name`) === "" || watch(`uploads.${index}.name`) === undefined}
                size="icon"
                variant="ghost"
               // onClick={() => viewFile(file.field)}
                className="size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
              >
                <DownloadIcon className="size-4" />
              </Button>
              <Button
                onClick={() => {
                  remove(index)
                }}
                size="icon"
                variant="ghost"
            //    onClick={() => removeFile(file.field)}
                className="size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
      }
    </TableBody>
  )
}