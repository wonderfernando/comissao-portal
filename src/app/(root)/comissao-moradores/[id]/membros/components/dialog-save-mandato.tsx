"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

 import { Children } from "@/app/(root)/interface";
import { mandatoSchema } from "../../../interface";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { saveMandatoAction } from "../../../actions";
import { Loader2 } from "lucide-react";
import { FormFields } from "./formFields";

export function SaveComissaoDialog({ children }: Children) {
    const { id } = useParams()

    const form = useForm({
        resolver: zodResolver(mandatoSchema),
        defaultValues: {
            comissao_id: Number(id),
            data_inicio: "",
            data_fim: "",
            membros: [{
                nome: '',
                funcao: '',
                contacto: '',
                email: '',
            }],
        }
    })
    console.log(form.formState.errors)
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { mutateAsync: saveMandato, isPending: isLoadingMandato } = useMutation({
        mutationFn: saveMandatoAction,
        onSuccess: (data) => {
            if(!data.success){
                toast.error("Erro", {
                    position: "bottom-center",
                    dismissible: true,
                    description: data?.mensagem,
                    duration: 8000,
                })
                return
            }
            setOpen(false)
            form.reset()
            toast.success("Sucesso", {
                position: "bottom-center",
                description: data?.mensagem,
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
                description: error.message || "Erro ao salvar o mandato",
                duration: 8000,
            })
        }
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl flex flex-col  max-h-[calc(100vh-1rem)]  ">
                <DialogHeader className="mb-0 p-0">
                    <DialogTitle >Adicionar mandato</DialogTitle>
                </DialogHeader>


                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(async (data) => {
                        console.log(data)
                        await saveMandato(data)
                    })} className="space-y-4 flex flex-col p-3 flex-1  overflow-y-auto">
                        <div className="flex-1 overflow-y-auto  ">
                            <FormFields />
                        </div>
                        <DialogFooter className="">
                            <Button type="button" variant="outline">Cancelar</Button>
                            <Button disabled={isLoadingMandato} className="cursor-pointer" type="submit">Salvar {isLoadingMandato && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}