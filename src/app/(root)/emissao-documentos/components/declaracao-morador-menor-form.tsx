"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, CreditCard, Calendar, MapPin, FileText, Printer, Loader2, Plus } from "lucide-react";
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
import { saveDocumentAction, printDocumentAction } from "../actions";

const formSchema = z.object({
    nome_completo: z.string().min(3, "Nome completo é obrigatório"),
    numero_bi: z.string().min(5, "Número do BI é obrigatório"),
    nacionalidade: z.string().min(2, "Nacionalidade é obrigatória"),
    localidade: z.string().optional(),
    data_emissao: z.string().min(1, "Data de emissão é obrigatória"),
    tipo_documento: z.string().min(1, "Tipo de documento é obrigatório"),
    data_nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
    nome_pai: z.string().min(3, "Nome do pai é obrigatório"),
    nome_mae: z.string().min(3, "Nome da mãe é obrigatório"),
    tipo_documento_id: z.coerce.number().default(2),
    ambito_territorial: z.string().min(1, "Âmbito territorial é obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
    onSuccess?: () => void;
}

export function DeclaracaoMoradorMenorForm() {
    const [open, setOpen] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [documentId, setDocumentId] = useState<number | null>(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome_completo: "",
            numero_bi: "",
            nacionalidade: "",
            localidade: "",
            data_emissao: "",
            tipo_documento: "",
            data_nascimento: "",
            nome_pai: "",
            nome_mae: "",
            tipo_documento_id: 3,
            ambito_territorial: "",
        },
    });

    const { mutate: saveDocument, isPending: isSubmitting } = useMutation({
        mutationFn: saveDocumentAction,
        onSuccess: async (result, variables) => {
            if (!result.success || !result.dados) {
                console.error(result);
                toast.error(result?.mensagem || "Não foi possivel emitir documento");
                return;
            }
            toast.success("Documento emitido com sucesso");
            try {
                // Merge localidade from form data into result for printing, 
                // in case backend doesn't return it yet.
                const printPayload = {
                    ...result,
                    dados: {
                        ...result.dados,
                        cidadao: {
                            ...result.dados.cidadao,
                            localidade: variables.localidade
                        }
                    }
                };

                const response = await fetch('/api/print/declaracao-morador-menor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(printPayload),
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
        console.log(data)
        saveDocument(data);
    };

    const handlePrint = async (docId: number) => {
        setIsPrinting(true);
        try {
            const result = await printDocumentAction("declaracao-morador", docId);

            if (result.success && result.pdfUrl) {
                // Open PDF in new tab
                window.open(result.pdfUrl, '_blank');
                toast.success("Documento pronto para impressão!");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Erro ao imprimir documento");
            console.error(error);
        } finally {
            setIsPrinting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            // Reset form when closing
            form.reset();
            setDocumentId(null);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Emitir Declaração
                </Button>
            </DialogTrigger>
            <DialogContent className=" w-full max-w-4xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Declaração de Morador para menor
                    </DialogTitle>
                    <DialogDescription>
                        Preencha os dados abaixo para emitir a declaração de morador para menor de 18 anos
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="w-full flex-1 p-6 pt-2 overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Grid Layout for Fields */}
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <FormField
                                    control={form.control}
                                    name="nome_completo"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2 lg:col-span-1">
                                            <FormLabel>Nome Completo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome completo" {...field} />
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
                                            <FormLabel>Número do BI</FormLabel>
                                            <FormControl>
                                                <Input placeholder="000000000XX00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="nacionalidade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nacionalidade</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Angolana" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="localidade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Localidade</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Luanda" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="data_nascimento"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Nascimento</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="data_emissao"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Emissão (ID)</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tipo_documento"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Documento</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="bilhete">Bilhete de Identidade</SelectItem>
                                                    <SelectItem value="passaporte">Passaporte</SelectItem>
                                                    <SelectItem value="cartao_eleitor">Cartão de Eleitor</SelectItem>
                                                    <SelectItem value="cartao_residente">Cartão de Residente</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="nome_pai"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome do Pai</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome do pai" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="nome_mae"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome da Mãe</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome da mãe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name="ambito_territorial"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Âmbito Territorial</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="rua">Rua</SelectItem>
                                                    <SelectItem value="predio">Prédio</SelectItem>
                                                    <SelectItem value="quarteirao">Quarteirão</SelectItem>
                                                    <SelectItem value="aldeia">Aldeia</SelectItem>
                                                    <SelectItem value="outro">Outro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Info Banner */}
                            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">ℹ️ Informação:</span> Após confirmar, o documento será salvo e automaticamente gerado para impressão.
                                </p>
                            </div>

                            {/* Action Buttons */}
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
                                    className="flex-1"
                                    disabled={isSubmitting || isPrinting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Salvando...
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
