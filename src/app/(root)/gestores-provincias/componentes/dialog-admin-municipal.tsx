"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Children } from "../../interface";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { saveAdminActionProvincial } from "../actions";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormFields } from "./formFields";
import { adminSchema } from "../schema";

export function SaveAdminMunicipalDialog({ children }: Children) {
    const form = useForm({
        resolver: zodResolver(adminSchema),
        defaultValues: {
            nome: "",
            email: '',
            telefone: '',
            bi: '',
            data_nascimento: '',
        }
    })
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { mutateAsync: saveAdmin, isPending: isLoading } = useMutation({
        mutationFn: saveAdminActionProvincial,
        onSuccess: (data) => {
            setOpen(false)
          
            if (!data?.success) {
                toast.error("Erro", {
                    position: "bottom-center",
                    dismissible: true,
                    description: data?.message || "Erro ao salvar a administrador",
                    duration: 8000,
                })
                return
            }
            toast.success("Sucesso", {
                position: "bottom-center",
                description: "Administrador adicionado com sucesso",
                duration: 8000,
                dismissible: true,
            })
            form.reset()
            router.refresh()
            // form.reset()
        },
        onError: (error: any) => {
            console.log(error)
            toast.error("Erro", {
                position: "bottom-center",
                dismissible: true,
                description: error.message || "Erro ao adicionar administrador",
                duration: 8000,
            })
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl  flex flex-col  ">
                <DialogHeader className="mb-0 p-0">
                    <DialogTitle >Registar  Gestor Provincial</DialogTitle>
                </DialogHeader>
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(async (data) => {
                        console.log(data)
                        await saveAdmin(data)
                    })} className="space-y-4 flex flex-col flex-1  overflow-y-auto">
                        <div className="flex-1 overflow-y-auto  ">
                            <FormFields />
                        </div>
                        <DialogFooter className="">
                            <Button variant="outline">Cancelar</Button>
                            <Button disabled={isLoading} className="cursor-pointer flex items-center gap-2" type="submit">Salvar {isLoading && <Loader2 className="animate-spin" />}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}