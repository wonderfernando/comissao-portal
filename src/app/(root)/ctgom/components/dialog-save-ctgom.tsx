"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Children } from "../../interface";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormFields } from "./formFields";
import { ctgomSchema } from "../interface";
import { useMutation } from "@tanstack/react-query";
import { saveCtgomAction } from "../actions";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "../../comissao-moradores/components/comp-551";

export function SaveCtgomDialog({ children }: Children) {
    const form = useForm({
        resolver: zodResolver(ctgomSchema),
        defaultValues: {
            ano: "",
            localizacao: '',
            municipio_id: undefined,
            uploads: [],
        }
    })
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { mutateAsync: saveCtgom, isPending: isLoadingSaveCtom } = useMutation({
        mutationFn: saveCtgomAction,
        onSuccess: (data) => {
            console.log(data)
            setOpen(false)
            form.reset()
            if (!data.success) {
                toast.error("Erro", {
                    position: "bottom-center",
                    dismissible: true,
                    description: data.message || "Erro ao salvar a CTGOM",
                    duration: 8000,
                })

                return
            }
            toast.success("Sucesso", {
                position: "bottom-center",
                description: "CTGOM salva com sucesso",
                duration: 8000,
                dismissible: true,
            })
            router.refresh()
            // form.reset()
        },
        onError: (error: any) => {
            console.log(error)
            toast.error("Erro", {
                position: "bottom-center",
                dismissible: true,
                description: error.message || "Erro ao salvar a CTGOM",
                duration: 8000,
            })
        }
    })
    console.log(form.formState.errors)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
           <DialogContent className="sm:max-w-3xl h-[calc(100vh-8rem)] flex flex-col  ">
                <DialogHeader className="mb-0 p-0">
                    <DialogTitle >Registar  CTGOM</DialogTitle>
                </DialogHeader>
                <Form  {...form}>
                    <form onSubmit={form.handleSubmit(async (data) => {
                        console.log(data)
                     await saveCtgom(data)
                    })} className="space-y-4 flex flex-col flex-1  overflow-y-auto">
                        <div className="flex-1 overflow-y-auto  ">
                            <Tabs defaultValue="dados" className="">
                                <TabsList className="">
                                    <TabsTrigger className="rounded-none data-[state=active]:text-white data-[state=active]:rounded-sm data-[state=active]:bg-primary  data-[state=active]:border-b-zinc-900" value="dados">Dados da Comissão</TabsTrigger>
                                    <TabsTrigger className="rounded-none data-[state=active]:text-white data-[state=active]:rounded-sm data-[state=active]:bg-primary  data-[state=active]:border-b-zinc-900" value="documentos">Documentos</TabsTrigger>
                                </TabsList>
                                <TabsContent value="dados" className=" ">
                                    <FormFields />
                                </TabsContent>
                                <TabsContent value="documentos" className="h-screen flex-1 flex">
                                    <FileUpload />
                                </TabsContent>
                            </Tabs>
                        </div>
                        <DialogFooter className="">
                            <Button variant="outline">Cancelar</Button>
                            <Button disabled={isLoadingSaveCtom} className="cursor-pointer flex items-center gap-2" type="submit">Salvar {isLoadingSaveCtom && <Loader2 className="animate-spin" />}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}