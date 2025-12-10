'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileIcon, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { uploadDocumentoComissao } from "../../../actions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadFilesAction } from "@/app/(root)/actions"

interface UploadDocumentoDialogProps {
    comissaoId: number
}

export function UploadDocumentoDialog({ comissaoId }: UploadDocumentoDialogProps) {
    const [open, setOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [nome, setNome] = useState("")
    const [descricao, setDescricao] = useState("")
    const [tipo, setTipo] = useState("")

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: any) => {
            return await uploadDocumentoComissao(data)
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message)
                setOpen(false)
                setSelectedFile(null)
                setNome("")
                setDescricao("")
                // Recarregar a página ou invalidar query
            } else {
                toast.error(data.message)
            }
        },
        onError: (error: any) => {
            toast.error(error.message || "Erro ao fazer upload do documento")
        }
    })
    const [isLoadingImage, setIsLoadingImage] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoadingImage(true)
        const file = e.target.files?.[0] as File
        if (file) {
            const formData = new FormData()
            formData.append("nome[]", file)
            const response = await uploadFilesAction(formData)
            console.log(response)
            setSelectedFile(file)
            // Auto-preencher o nome com o nome do arquivo (sem extensão)
            const fileName = file.name.replace(/\.[^/.]+$/, "")
            setNome(response?.uploads[0]?.nome) 
            setTipo(response?.uploads[0]?.tipo)
        }
        setIsLoadingImage(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile) {
            toast.error("Por favor, selecione um arquivo")
            return
        }

        if (!descricao.trim()) {
            toast.error("Por favor, informe a descrição do documento")
            return
        }

        // Determinar o tipo baseado na extensão do arquivo
        const extension = selectedFile.name.split('.').pop()?.toLowerCase()
        let tipo = "outro"
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
            tipo = "imagem"
        } else if (extension === 'pdf') {
            tipo = "pdf"
        } else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension || '')) {
            tipo = "video"
        }
        mutate({id: comissaoId, data: {nome, descricao, tipo}})
    }

    const removeFile = () => {
        setSelectedFile(null)
        setNome("")
        setDescricao("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Adicionar Documento
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Documento</DialogTitle>
                    <DialogDescription>
                        Faça upload de um documento para esta comissão de moradores.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">

                        <div className="grid gap-2">
                            <Label htmlFor="descricao">Descrição do documento</Label>
                            <Input
                                id="descricao"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                placeholder="Ex: Estatutos, ata de reunião, etc."
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="file">Arquivo</Label>
                            {!selectedFile ? (
                                <div className="flex items-center justify-center w-full">
                                    <label
                                        htmlFor="file"
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            
                                           {!isLoadingImage ? <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                           :
                                           <Loader2 className="w-8 h-8 mb-2 text-muted-foreground animate-spin" />
                                           }
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PDF, Imagens
                                            </p>
                                        </div>
                                         <Input
                                            id="file"
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.avi,.mov,.wmv,.doc,.docx"
                                        /> 
                                    </label>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                                    <div className="flex items-center gap-2">
                                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{selectedFile.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {(selectedFile.size / 1024).toFixed(2)} KB
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={removeFile}
                                        className="h-8 w-8"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending || !selectedFile}>
                            {isPending ? "Enviando..." : "Adicionar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
