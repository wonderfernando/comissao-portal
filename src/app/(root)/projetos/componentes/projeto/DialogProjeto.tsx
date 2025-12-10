"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
 
import { useMutation } from "@tanstack/react-query"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProjetoCreateSchema } from "../../projeto-schema"
import { postProjetoAction } from "@/app/(root)/actions"
import { ProjetoForm } from "./form-projeto"

export function DialogProjeto() {
    const form = useForm({
        resolver: zodResolver(ProjetoCreateSchema),
        defaultValues: {
            titulo: "",
            descricao: "",
            custo_estimado: "",
            localizacao: "",
            categoria_id: 1,
            ano: "2025-01-01",
            uploads: []
        }
    });
    const [open, setOpen] = React.useState(false)
    const router = useRouter()
    const { mutateAsync: saveProjeto, isPending: isLoadingSaveProjeto } = useMutation({
        mutationFn: postProjetoAction,
        onSuccess: (data) => {
            console.log(data)
            if (!data.success) {
                toast.error("Erro", {
                    position: "bottom-center",
                    dismissible: true,
                })
                return
            }
            setOpen(false)
            form.reset()
            toast.success("Sucesso", {
                position: "bottom-center",
                description: "Projeto salvo com sucesso",
                duration: 8000,
                dismissible: true,
            })
            router.refresh()
            form.reset()
        },
        onError: (error: any) => {
            console.log(error)
            toast.error("Erro", {
                position: "bottom-center",
                dismissible: true,
                description: error.message || "Erro ao salvar o projeto",
                duration: 8000,
            })
        }
    })


    console.log(form.formState.errors)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button >Registar  Projeto +</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl h-[calc(100vh-10rem)] flex flex-col  ">
                <div className=" w-full overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Adicionar Projeto</DialogTitle>
                        <DialogDescription>Defina os detalhes do projeto.</DialogDescription>
                    </DialogHeader>
                    <div className="pb-0 w-full px-2">
                        <Form  {...form}>
                            <form onSubmit={form.handleSubmit(async (data) => {
                                console.log(data)
                                await saveProjeto(data)

                            })} className="w-full space-y-4 flex flex-col px-2 flex-1  overflow-y-auto">
                                <div className="flex-1 overflow-y-auto  ">
                                    <ProjetoForm />
                                </div>
                                <DialogFooter>
                                    <Button disabled={isLoadingSaveProjeto} className="cursor-pointer flex items-center gap-2" type="submit">Salvar {isLoadingSaveProjeto && <Loader2 className="animate-spin" />}</Button>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancelar</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </form>
                        </Form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
