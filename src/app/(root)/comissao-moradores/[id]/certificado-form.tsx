"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, Loader2, Award } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { saveDocumentAction } from "../../emissao-documentos/actions";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Comissao } from "../interface";

const formSchema = z.object({
    nome: z.string(),
    localizacao: z.string(),
    delimitacao_geografica: z.string(),
    contacto: z.string(),
    email: z.string(),
    provincia: z.string(),
    municipio: z.string(),
    bairro: z.string(),
    ambito_territorial: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface CertificadoComissaoFormProps {
    comissao: Comissao | null;
}

export function CertificadoComissaoForm({ comissao }: CertificadoComissaoFormProps) {
    const [open, setOpen] = useState(false);
    // const [isSubmitting, setIsSubmitting] = useState(false); // Handled by mutation

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: comissao?.nome || "",
            localizacao: comissao?.localizacao || "",
            delimitacao_geografica: comissao?.delimitacao_geografica || "",
            contacto: comissao?.contacto || "",
            email: comissao?.email || "",
            provincia: comissao?.bairro?.comuna?.municipio?.provincia?.nome || "",
            municipio: comissao?.bairro?.comuna?.municipio?.nome || "",
            bairro: comissao?.bairro?.nome || "",
            ambito_territorial: comissao?.ambito_territorial || "",
        },
    });

    // Update form values if comissao changes (though likely stable in this view)
    /* useEffect(() => {
        if (comissao) {
            form.reset({
                nome: comissao.nome,
                localizacao: comissao.localizacao || "",
                // ...
            });
        }
    }, [comissao, form]); */

    const onSubmit = (data: FormValues) => {
        saveDocument({
            ...data,
            tipo_documento_id: 6 // Assuming 6 or similar for Commission Certificate based on pattern, or just sending data for now.
        });
    };

    const { mutate: saveDocument, isPending: isSubmitting } = useMutation({
        mutationFn: saveDocumentAction,
        onSuccess: async (result) => {
            if (!result.success || !result.dados) {
                console.error(result);
                toast.error(result?.mensagem || "Não foi possivel emitir documento");
                return;
            }
            toast.success("Certificado emitido com sucesso");
            try {
                const response = await fetch('/api/print/certificado-comissao', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(result),
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank');
                    setOpen(false);
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
            toast.error("Erro ao processar certificado");
        }
    });

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen && comissao) {
            form.reset({
                nome: comissao.nome,
                localizacao: comissao.localizacao || "",
                delimitacao_geografica: comissao.delimitacao_geografica || "",
                contacto: comissao.contacto || "",
                email: comissao.email || "",
                provincia: comissao.bairro?.comuna?.municipio?.provincia?.nome || "",
                municipio: comissao.bairro?.comuna?.municipio?.nome || "",
                bairro: comissao.bairro?.nome || "",
                ambito_territorial: comissao.ambito_territorial || "",
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="link" className="cursor-pointer">
                    Emitir Certificado
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[900px] max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        Certificado de Comissão
                    </DialogTitle>
                    <DialogDescription>
                        Revise os dados da comissão para a emissão do certificado.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 p-6 pt-2 overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Grid Layout for Fields */}
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <FormField
                                    control={form.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2 lg:col-span-3">
                                            <FormLabel>Nome da Comissão</FormLabel>
                                            <FormControl>
                                                <Input {...field} readOnly className="bg-muted" />
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
                                            <FormControl>
                                                <Input {...field} readOnly className="bg-muted" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="localizacao"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Localização</FormLabel>
                                            <FormControl>
                                                <Input {...field} readOnly className="bg-muted" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="delimitacao_geografica"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-3">
                                            <FormLabel>Delimitação Geográfica</FormLabel>
                                            <FormControl>
                                                <Input {...field} readOnly className="bg-muted" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="contacto"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contacto</FormLabel>
                                            <FormControl>
                                                <Input {...field} readOnly className="bg-muted" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="sm:col-span-2">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} readOnly className="bg-muted" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="provincia"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Província</FormLabel>
                                            <FormControl>
                                                <Input {...field} readOnly className="bg-muted" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="municipio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Município</FormLabel>
                                            <FormControl>
                                                <Input {...field} readOnly className="bg-muted" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bairro"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bairro</FormLabel>
                                            <FormControl>
                                                <Input {...field} readOnly className="bg-muted" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Info Banner */}
                            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">ℹ️ Informação:</span> Os dados acima são preenchidos automaticamente com base no cadastro da comissão.
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
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processando...
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
