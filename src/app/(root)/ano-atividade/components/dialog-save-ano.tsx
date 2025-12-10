"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { anoSchema } from "../interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { saveAnoAtividadeAction } from "../actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function DialogSaveAno({children}: {children?: React.ReactNode}) {

    const [ano, _] = useState<string[]>(() => {
        let currentYear = Number(new Date().getFullYear()) + 1;
        const years: string[] = [];
        for (let index = 5; index > 1; index--) {
            years.push((currentYear--).toString());
        }
        return [...years];
    });
    const form = useForm({
        resolver: zodResolver(anoSchema),
        defaultValues: {
            ano: new Date().getFullYear().toString(),
        },
    });

    const { mutateAsync: saveAnoAtividade, isPending: isSaving } = useMutation({
        mutationFn: saveAnoAtividadeAction,
        onSuccess: (data) => {
            console.log("Ano de actividade salvo com sucesso:", data);
            if (!data.success) {
                toast.error(data.message || "Erro ao salvar ano de actividade.");
                return;
            }
           // form.reset();
          setIsOpen(false);
            toast.success("Ano de actividade salvo com sucesso.");
        },
        onError: (error) => {
            console.log("Erro ao salvar ano de actividade:", error);
        }
    });

    async function onSubmitData(data: any) {
        console.log("Dados do formulário:", data);
        await saveAnoAtividade(data);
    }

    const [isOpen, setIsOpen] = useState(false);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children ? children : <Button>Registrar Ano +</Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Registro de Ano de Actividade
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitData)} className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                            <FormField
                                control={form.control}
                                name="ano"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ano</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o ano" />
                                                </SelectTrigger>
                                                <SelectContent className="w-full">
                                                    {ano.map((year) => (
                                                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                            <Button variant={"outline"} onClick={() => setIsOpen(false)} type="button">Cancelar</Button>
                            <Button disabled={isSaving} type="submit" className="flex items-center gap-2">Salvar {isSaving && <Loader2 className="animate-spin" />}</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}