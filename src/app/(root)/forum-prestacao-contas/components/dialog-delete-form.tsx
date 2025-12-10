"use client"
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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { ReactNode, useState } from "react"
import { deleteForum } from "../actions"
import { toast } from "sonner"



interface IProps {
    
    id?: number,
    name: string,
    open: boolean,
    setOpen: (open: boolean) => void
}
export default function DialogDeleteForum({  name, id, open, setOpen }: IProps) {

    const client = useQueryClient()
      const { mutateAsync: removeForum, isPending: isLoading } = useMutation({
         mutationFn: deleteForum,
         onSuccess: (data) => {
            if(!data.success) {
                toast.error("Erro ao eliminar fórum de recolha de contribuição")
                return
            }
             toast.success("Fórum de recolha de contribuição eliminado com sucesso")
             setOpen(false)
         }
     })

    async function handleDelete() { // await deleteEvento(eventId)
        if (!id) return
        await removeForum(id)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar eliminação</DialogTitle>
                    <DialogDescription>
                        Tem a certeza que deseja eliminar o Forum <strong className="text-black">{name}</strong>?<br />
                        Esta operação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)} variant={"outline"}>Cancelar</Button>
                    <Button disabled={isLoading || !id} onClick={handleDelete} className="bg-red-800 hover:bg-red-600 text-white flex items-center justify-center gap-2">Confirmar {isLoading && <Loader2 className="animate-spin" />}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}