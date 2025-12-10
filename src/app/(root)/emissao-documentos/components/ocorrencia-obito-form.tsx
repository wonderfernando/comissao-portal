"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, Plus, Loader2, UserX } from "lucide-react";
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
    // Deceased Info
    nome_completo: z.string().min(3, "Nome completo é obrigatório"),
    numero_bi: z.string().optional(),
    nacionalidade: z.string().min(2, "Nacionalidade é obrigatória").default("Angolana"),
    tipo_documento: z.string().min(1, "Tipo de documento é obrigatório"),
    data_nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
    nome_pai: z.string().min(3, "Nome do pai é obrigatório"),
    nome_mae: z.string().min(3, "Nome da mãe é obrigatório"),
    estado_civil: z.string().default("Solteiro"),
    ambito_territorial: z.string().min(1, "Âmbito territorial é obrigatório").default("Bairro"),
    rua: z.string().optional(),
    casa_numero: z.string().optional(),

    // Death Info
    data_obito: z.string().min(1, "Data do óbito é obrigatória"),

    // Declarant Info
    nome_declarante: z.string().min(3, "Nome do declarante é obrigatório"),

    // Technical
    tipo_documento_id: z.coerce.number().default(4),
});

type FormValues = z.infer<typeof formSchema>;

export function OcorrenciaObitoForm() {
    const [open, setOpen] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [documentId, setDocumentId] = useState<number | null>(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome_completo: "",
            numero_bi: "",
            nacionalidade: "Angolana",
            tipo_documento: "Bilhete de Identidade",
            data_nascimento: "",
            nome_pai: "",
            nome_mae: "",
            estado_civil: "Solteiro",
            ambito_territorial: "Bairro",
            rua: "",
            casa_numero: "",
            data_obito: "",
            nome_declarante: "",
            tipo_documento_id: 4,
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
                // Pass extra fields that might not be in the core 'cidadao' object unless backend handles them
                // We'll inject them into the print 'dados' payload
                const printPayload = {
                    ...result,
                    dados: {
                        ...result.dados,
                        // If backend didn't save these in cidadao, we manually add them from form values used in submission if needed
                        // But let's assume result.dados has what we need or we pass specific overrides
                        data_obito: result.dados.emitir_documento?.[0]?.dados?.data_obito, // Try to find it
                        nome_declarante: result.dados.emitir_documento?.[0]?.dados?.nome_declarante
                    }
                };

                // Actually, saveDocumentAction returns { success, dados: { id, emitir_documento: [...], ... } }
                // We need to fetch the full object again or construct it?
                // The print route expects { dados: { cidadao, comissao, hash_qr, ... } }
                // Ideally saveDocumentAction should return the formatted print payload or we use the local API to generate it?
                // Wait, saveDocumentAction just calls `save`. 
                // In generic `documents-table`, we use `originalData`. 

                // Let's use the same flow as the generic table: call the local print route with the result.
                // We need to construct the compatible payload.
                // The result from saveDocumentAction usually contains the created record.

                // For simplicity, we'll assume the same structure. 
                // If saveDocumentAction returns the standard API response, we might need to conform it.
                // But wait, the standard `saveDocumentAction` returns `DadosDTO`.
                // `DadosDTO` has `emitir_documento`.

                const response = await fetch('/api/print/ocorrencia-obito', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        success: true,
                        dados: {
                            cidadao: { ...form.getValues(), ...result.dados.dados }, // Merge form values to ensure we have data_obito etc if not in response
                            comissao: result.dados.comissao,
                            hash_qr: result.dados.hash_qr,
                            data_obito: form.getValues().data_obito,
                            nome_declarante: form.getValues().nome_declarante,
                            rua: form.getValues().rua,
                            casa_numero: form.getValues().casa_numero
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
        saveDocument(data);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            form.reset();
            setDocumentId(null);
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
            <DialogContent className="w-full max-w-5xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2">
                        <UserX className="w-5 h-5 text-red-500" />
                        Ocorrência de Óbito
                    </DialogTitle>
                    <DialogDescription>
                        Preencha os dados abaixo para emitir a Ocorrência de Óbito
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 p-6 pt-2 overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Deceased Info */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">Dados do Falecido</h3>
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
                                        name="estado_civil"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Estado Civil</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione..." />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Solteiro">Solteiro(a)</SelectItem>
                                                        <SelectItem value="Casado">Casado(a)</SelectItem>
                                                        <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
                                                        <SelectItem value="Viúvo">Viúvo(a)</SelectItem>
                                                    </SelectContent>
                                                </Select>
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
                                                        <SelectItem value="Bilhete de Identidade">Bilhete de Identidade</SelectItem>
                                                        <SelectItem value="Passaporte">Passaporte</SelectItem>
                                                        <SelectItem value="Cartão de Eleitor">Cartão de Eleitor</SelectItem>
                                                    </SelectContent>
                                                </Select>
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
                                    <FormField
                                        control={form.control}
                                        name="rua"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rua (Opcional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nome da rua" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="casa_numero"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Casa n.º (Opcional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Número da casa" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Occurrence Info */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">Dados do Óbito e Declarante</h3>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="data_obito"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Data do Óbito</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="nome_declarante"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome do Declarante</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nome de quem presta a informação" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Info Banner */}
                            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">ℹ️ Informação:</span> Este documento é uma informação oficial de ocorrência de óbito.
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
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
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
