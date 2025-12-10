"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PropostaForm } from "./form-proposta"
import { useMutation } from "@tanstack/react-query"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PropostaCreateSchema } from "../../proposta-schema"
import { postPropostaAction } from "@/app/(root)/actions"

export function DialogProposta() {
  const form = useForm({
    resolver: zodResolver(PropostaCreateSchema),
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
  const { mutateAsync: saveProposta, isPending: isLoadingSaveProposta } = useMutation({
    mutationFn: postPropostaAction,
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
        description: "Proposta salva com sucesso",
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
        description: error.message || "Erro ao salvar a proposta",
        duration: 8000,
      })
    }
  })


  console.log(form.formState.errors)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button >Registar  Proposta +</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl h-[calc(100vh-10rem)] flex flex-col  ">
        <div className=" w-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Proposta</DialogTitle>
            <DialogDescription>Defina os detalhes da proposta.</DialogDescription>
          </DialogHeader>
          <div className="pb-0 w-full px-2">
            <Form  {...form}>
              <form onSubmit={form.handleSubmit(async (data) => {
                console.log(data)
                await saveProposta(data)
               
              })} className="w-full space-y-4 flex flex-col px-2 flex-1  overflow-y-auto">
                <div className="flex-1 overflow-y-auto  ">
                  <PropostaForm />
                </div>
                <DialogFooter>
                  <Button disabled={isLoadingSaveProposta} className="cursor-pointer flex items-center gap-2" type="submit">Salvar {isLoadingSaveProposta && <Loader2 className="animate-spin" />}</Button>
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
