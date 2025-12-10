"use client"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { z } from "zod"
import { getAllProjectosAction } from "@/app/(root)/actions"
import { relatorioSchema } from "../schema"
import {  saveFormPrestacaoContas } from "../../../actions"
import { toast } from "sonner"
type RelatorioFormData = z.infer<typeof relatorioSchema>

export function SubmitRelatorioDialog({ id }: { id: string }) {
    const [open, setOpen] = useState(false)
    const { register, handleSubmit, setValue, formState:{errors}, reset } = useForm({
        resolver: zodResolver(relatorioSchema),
        defaultValues: {
            forun_id: id,
            projeto_id: 0,
            resumo: "",
            avaliacao: "positivo",
            feedback: "_",

            uploads: [],
        },
    })

    const mutation = useMutation({
        mutationFn: saveFormPrestacaoContas,
        onSuccess: (data) => {
            if (!data.success) {
                toast.error("Erro ao submeter o relatório. Tente novamente.")
                return
            }
            toast.success("Relatório submetido com sucesso!")
            reset()
            setOpen(false)
        },
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const uploads = files.map((file) => ({
            tipo: file.type.includes("pdf") ? "pdf" : "imagem",
            nome: file.name,
        }))
        setValue("uploads", uploads as {tipo: "pdf" | "imagem", nome: string}[])
    }
    const { data: projectos, isPending } = useQuery({
        queryKey: ["projectos"],
        queryFn: getAllProjectosAction,
    })



    console.log(projectos)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Submeter Relatório</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Relatório de Projeto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit((data) => { 
                    console.log(data);
                   mutation.mutate(data)
                })} className="space-y-4">


                    <div>
                        <Label>Projeto</Label>
                        <Select onValueChange={(value) => setValue("projeto_id", Number(value))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o projeto" />
                            </SelectTrigger>
                            <SelectContent>
                                {isPending && <SelectItem value="0" disabled>Carregando...</SelectItem>}
                                {
                                    projectos?.projeto?.map((proposta) => (
                                        <SelectItem key={proposta.id} value={proposta.id.toString()}>{proposta.titulo}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Avaliação</Label>
                        <Select onValueChange={(value) => setValue("avaliacao", value?.toString() as "positivo" | "negativo" | "neutro")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a avaliação" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="positivo">Positivo</SelectItem>
                                <SelectItem value="negativo">Negativo</SelectItem>
                                <SelectItem value="neutro">Neutro</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.avaliacao && <p className="text-sm text-red-600">{errors.avaliacao.message}</p>}
                    </div>

                    <div>
                        <Label>Resumo</Label>
                        <Textarea {...register("resumo")} placeholder="Resumo das atividades..." />
                        {errors.resumo && <p className="text-sm text-red-600">{errors.resumo.message}</p>}
                    </div>

      

    

                    <div>
                        <Label>Uploads</Label>
                        <Input type="file" multiple accept=".pdf,image/*" onChange={handleFileChange} />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Enviando..." : "Submeter"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
