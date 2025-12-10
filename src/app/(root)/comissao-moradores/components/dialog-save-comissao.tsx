"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Children } from "../../interface";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { comissaoSchema } from "../interface";
import { ComissaoForm } from "./form-comissao";
import { useMutation } from "@tanstack/react-query";
import { saveComissaoMoradores } from "../actions";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function SaveComissaoDialog({ children }: Children) {
    const form = useForm({
        resolver: zodResolver(comissaoSchema),
        defaultValues: {
            nome: '',
            delimitacao_geografica: '',
            localizacao: '',
            contacto: '',
            email: '',
            uploads: [
               
            ],
        }
    })
    const [open, setOpen] = useState(false)
    const { mutateAsync: saveAdmin, isPending: isLoading } = useMutation({
        mutationFn: saveComissaoMoradores,
        onSuccess: (data) => {
            setOpen(false)
            form.reset()
            if (!data?.success) {
                toast.error("Erro", {
                    position: "bottom-center",
                    dismissible: true,
                    description: data?.mensagem || "Erro ao salvar comissão de moradores",
                    duration: 8000,
                })
               
                return
            }
            setOpen(false)
            toast.success("Sucesso", {
                position: "bottom-center",
                description: "Comissão de moradores adicionada com sucesso",
                duration: 8000,
                dismissible: true,
            })
        },
        onError: (error: any) => {
            console.log(error)
            toast.error("Erro", {
                position: "bottom-center",
                dismissible: true,
                description: error.message || "Erro ao adicionar comissão de moradores",
                duration: 8000,
            })
        }
    })

    async function submit(data: any) {
        await saveAdmin(data)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl h-[calc(100vh-1rem)] flex flex-col  ">
                <DialogHeader className="mb-0 p-0">
                    <DialogTitle >Registar  Comissão</DialogTitle>
                </DialogHeader>
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit( async (data) => {
                        console.log(data);
                        await submit(data)
                    })} className="space-y-4 flex flex-col p-3 flex-1  overflow-y-auto">
                        <div className="flex-1 overflow-y-auto  ">
                            <ComissaoForm />
                        </div>
                        <DialogFooter className="">
                            <Button variant="outline">Cancelar</Button>
                            <Button disabled={isLoading} type="submit">Salvar {isLoading && <Loader2 className="animate-spin"/>}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}