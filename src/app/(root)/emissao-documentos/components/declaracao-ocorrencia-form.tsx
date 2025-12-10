"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, Plus, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveDocumentAction } from "../actions";

const formSchema = z.object({
    // Standard fields required by API/DB - even if minimal for this doc
    nome_completo: z.string().optional(), // Using this as declarant name fallback
    nome_declarante: z.string().min(3, "Nome de quem denuncia/participa é obrigatório"),
    tipo_declaracao: z.string().default("Participo"),
    descricao_ocorrencia: z.string().min(10, "Descreva a ocorrência com mais detalhes"),

    // Required generic fields to satisfy backend if strict
    // We'll set defaults for these as they might not be relevant to the doc content itself strictly but needed for the record
    numero_bi: z.string().optional(),
    nacionalidade: z.string().default("Angolana"),
    tipo_documento_id: z.coerce.number().default(5),
    ambito_territorial: z.string().default("Bairro"),
});

type FormValues = z.infer<typeof formSchema>;

export function DeclaracaoOcorrenciaForm() {
    const [open, setOpen] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome_completo: "",
            nome_declarante: "",
            tipo_declaracao: "Participo",
            descricao_ocorrencia: "",
            numero_bi: "",
            nacionalidade: "Angolana",
            tipo_documento_id: 5,
            ambito_territorial: "Bairro",
        },
    });

    const { mutate: saveDocument, isPending: isSubmitting } = useMutation({
        mutationFn: saveDocumentAction,
        onSuccess: async (result) => {
            if (!result.success || !result.dados) {
                console.error(result);
                toast.error(result?.mensagem || "Não foi possivel emitir documento");
                return;
            }

            toast.success("Documento emitido com sucesso");

            try {
                // Construct payload for print
                const response = await fetch('/api/print/declaracao-ocorrencia', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        success: true,
                        dados: {
                            cidadao: {
                                ...form.getValues(),
                                nome_completo: form.getValues().nome_declarante // Ensure declarant name is primary
                            },
                            comissao: result.dados.comissao,
                            hash_qr: result.dados.hash_qr,
                            descricao_ocorrencia: form.getValues().descricao_ocorrencia,
                            tipo_declaracao: form.getValues().tipo_declaracao,
                            nome_declarante: form.getValues().nome_declarante
                        }
                    }),
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank');
                    setOpen(false);
                    form.reset();
                } else {
                    const error = await response.json();
                    toast.error(error.details || "Erro ao gerar PDF");
                }
            } catch (error) {
                console.error("Print error:", error);
                toast.error("Erro ao iniciar impressão");
            }
        },
        onError: (error) => {
            console.error(error);
            toast.error("Erro ao processar documento");
        }
    });

    const onSubmit = (data: FormValues) => {
        // Sync nome_completo with nome_declarante for the backend record if needed
        const submissionData = {
            ...data,
            nome_completo: data.nome_declarante
        };
        saveDocument(submissionData);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            form.reset();
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Emitir Ocorrência
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[800px] max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Declaração de Ocorrência
                    </DialogTitle>
                    <DialogDescription>
                        Registre uma denúncia ou participação de ocorrência
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 p-6 pt-2 overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <div className="space-y-4">
                                <div className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="nome_declarante"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome do Declarante</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Quem está fazendo a participação?" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="numero_bi"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nº BI do Declarante (Opcional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="000000000XX00" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="tipo_declaracao"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tipo</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Participo">Participação</SelectItem>
                                                        <SelectItem value="Denuncio">Denúncia</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="descricao_ocorrencia"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descrição da Ocorrência</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Descreva detalhadamente o ocorrido..."
                                                        className="min-h-[150px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/10">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">ℹ️ Importante:</span> O declarante atesta a veracidade das informações prestadas.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4 sticky bottom-0 bg-background pb-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleOpenChange(false)}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                                    disabled={isSubmitting || isPrinting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Emitindo...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="w-4 h-4 mr-2" />
                                            Confirmar e Imprimir
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
