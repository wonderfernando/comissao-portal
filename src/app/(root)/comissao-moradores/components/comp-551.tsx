"use client"

import {
  AlertCircleIcon,
  DownloadIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  Loader2,
  Trash2Icon,
  UploadCloudIcon,
  UploadIcon,
  VideoIcon,
} from "lucide-react"

import {
  formatBytes,
  useFileUpload,
} from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { uploadFilesAction } from "../../actions"
import { useFieldArray, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { FormControl } from "@/components/ui/form"
 
 
export const getFileIcon = ( name: string ) => {


  if (
    name?.includes("pdf") ||
    name?.endsWith(".pdf") ||
    name?.includes("word") ||
    name?.endsWith(".doc") ||
    name?.endsWith(".docx")
  ) {
    return <FileTextIcon className="size-4 opacity-60" />
  } else if (
    name?.includes("zip") ||
    name?.includes("archive") ||
    name?.endsWith(".zip") ||
    name?.endsWith(".rar")
  ) {
    return <FileArchiveIcon className="size-4 opacity-60" />
  } else if (
    name?.includes("excel") ||
    name?.endsWith(".xls") ||
    name?.endsWith(".xlsx")
  ) {
    return <FileSpreadsheetIcon className="size-4 opacity-60" />
  } else if (name?.includes("video/")) {
    return <VideoIcon className="size-4 opacity-60" />
  } else if (name?.includes("audio/")) {
    return <HeadphonesIcon className="size-4 opacity-60" />
  } else if (name?.startsWith("image/")) {
    return <ImageIcon className="size-4 opacity-60" />
  }
  return <FileIcon className="size-4 opacity-60" />
}

export default function FileUpload() {
  const maxSize = 10 * 1024 * 1024 // 10MB default
  const maxFiles = 10

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: false,
    maxFiles,
    maxSize,
  })

  const { append,remove, fields } = useFieldArray({
    name: "uploads",
  })

  const {watch, register} = useFormContext()

  const { mutateAsync: uploadFile, isPending } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const formData = new FormData()
      formData.append("nome[]", file)
      const response = await uploadFilesAction(formData)
      console.log("response ", response)
      setCaminho(response.uploads?.[0]?.caminho || "")
      append({ nome: response.uploads?.[0]?.nome, tipo: response?.uploads?.[0]?.tipo })
      clearFiles()
    },
  })
  useEffect(() => {
    console.log("files ", files)
    async function upload() {
      if (files.length > 0 && files[0].file instanceof File)
        uploadFile({ file: files[0].file as File })
    }
    upload()
  }, [files])

  const [caminho, setCaminho] = useState("")

  function preview(url: string) {
    window.open(url, "_blank")
  }
  return (
    <div className="flex flex-col gap-2 w-full"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="flex min-h-56 flex-col items-center rounded-xl border border-dashed border-input p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50 data-[files]:hidden"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload files"
        />
        <div className=" flex flex-col items-center justify-center text-center">
          <div
            className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
            aria-hidden="true"
          >
            <FileIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Carregar Documentos</p>
          <p className="text-xs text-muted-foreground">
            Tamanho Max 10MB
          </p>
          <Button disabled={isPending} type="button" variant="outline" className="mt-4" onClick={(e) => { e.stopPropagation();openFileDialog()}}>
            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
            Selecionar arquivos {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </div>
      </div>
      {fields.length > 0 && (
        <>
          {/* Table with files */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium">Ficheiros ({fields.length})</h3>
            <div className="flex gap-2">
      
            </div>
          </div>
          <div className="overflow-hidden rounded-md border bg-background">
            <Table>
              <TableHeader className="text-xs">
                <TableRow className="bg-muted/50">
                  <TableHead className="h-9 py-2">Nome</TableHead>
                  <TableHead className="h-9 py-2">Tipo do documento</TableHead>
                  <TableHead className="h-9 py-2">Tipo</TableHead>
                  <TableHead className="h-9 w-0 py-2 text-right">
                    Acções
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[13px]">
                {fields.map((file, index) => (
                  <TableRow key={file.id}>
                    <TableCell className="max-w-48 py-2 font-medium">
                      <span className="flex items-center gap-2">
                        <span className="shrink-0">{getFileIcon(watch(`uploads.${index}.nome`))}</span>{" "}
                        <span className="truncate">{watch(`uploads.${index}.nome`)}</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <FormControl>
                        <Input className="w-full" {...register(`uploads.${index}.descricao`)} />
                      </FormControl>
                    </TableCell>
                    <TableCell className="py-2 text-muted-foreground">
                      {watch(`uploads.${index}.tipo`)}
                    </TableCell>

                    <TableCell className="py-2 text-right whitespace-nowrap">
                      <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        className="size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
                    //    aria-label={`Download ${file.file.name}`}
                        onClick={() => preview(`${process.env.NEXT_PUBLIC_IMAGE}/${caminho}`)}
                      >
                        <DownloadIcon className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        className="size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
                 //       aria-label={`Remove ${file.file.name}`}
                        onClick={() => remove(index)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {errors.length > 0 && (
        <div
          className="flex items-center gap-1 text-xs text-destructive"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}


    </div>
  )
}
