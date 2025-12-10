"use client"

import { useState } from "react";
import { FileText, Baby, Skull, AlertCircle, Printer, Eye, Calendar, User } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DocumentRecord, DocumentType } from "../interface";
import { printDocumentAction } from "../actions";
import { toast } from "sonner";

interface Props {
    documents: DocumentRecord[];
}

const documentTypeLabels: Record<DocumentType, string> = {
    'declaracao-morador': 'Declaração de Morador',
    'declaracao-morador-menor': 'Declaração Menor de Idade',
    'ocorrencia-obito': 'Ocorrência de Óbito',
    'declaracao-ocorrencia': 'Declaração de Ocorrência',
};

const documentTypeIcons: Record<DocumentType, any> = {
    'declaracao-morador': FileText,
    'declaracao-morador-menor': Baby,
    'ocorrencia-obito': Skull,
    'declaracao-ocorrencia': AlertCircle,
};

const documentTypeColors: Record<DocumentType, string> = {
    'declaracao-morador': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    'declaracao-morador-menor': 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    'ocorrencia-obito': 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
    'declaracao-ocorrencia': 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
};

export function DocumentsTable({ documents }: Props) {
    const [printingId, setPrintingId] = useState<number | null>(null);

    const handlePrint = async (doc: DocumentRecord) => {
        setPrintingId(doc.id);
        try {
            // Use local API route for printing if we have the data
            if (doc.originalData) {
                let printUrl = '/api/print/declaracao-morador';
                if (doc.tipo === 'declaracao-morador-menor') {
                    printUrl = '/api/print/declaracao-morador-menor';
                } else if (doc.tipo === 'ocorrencia-obito') {
                    printUrl = '/api/print/ocorrencia-obito';
                } else if (doc.tipo === 'declaracao-ocorrencia') {
                    printUrl = '/api/print/declaracao-ocorrencia';
                }

                const response = await fetch(printUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        success: true,
                        dados: {
                            cidadao: doc.originalData.dados,
                            comissao: doc.originalData.comissao,
                            hash_qr: doc.originalData.hash_qr
                        }
                    }),
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank');
                    toast.success("Documento pronto para impressão!");
                } else {
                    const error = await response.json();
                    toast.error(error.details || "Erro ao gerar PDF");
                }
                return;
            }

            // Fallback for old method
            const result = await printDocumentAction(doc.tipo, doc.id);

            if (result.success && result.pdfUrl) {
                window.open(result.pdfUrl, '_blank');
                toast.success("Documento pronto para impressão!");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Erro ao imprimir documento");
            console.error(error);
        } finally {
            setPrintingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('pt-AO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    if (documents.length === 0) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                        <div className="p-4 rounded-full bg-muted">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Nenhum documento emitido</h3>
                            <p className="text-sm text-muted-foreground">
                                Clique em "Emitir Novo Documento" para começar
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Documentos Emitidos</CardTitle>
                <CardDescription>
                    Lista de todos os documentos emitidos pela comissão
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Tipo de Documento</TableHead>
                                <TableHead>Declarante</TableHead>
                                <TableHead className="w-[140px]">BI</TableHead>
                                <TableHead className="w-[120px]">Data de Emissão</TableHead>
                                <TableHead className="w-[100px] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map((doc) => {
                                  return (
                                    <TableRow key={doc.id} className="group">
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`flex items-center gap-2 w-fit ${documentTypeColors[doc.tipo]}`}
                                            >
                                                
                                                <span className="text-xs font-medium">
                                                    {documentTypeLabels[doc.tipo]}
                                                </span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">{doc.nome_solicitante}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground font-mono">
                                                {doc.bi_solicitante}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(doc.data_emissao)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handlePrint(doc)}
                                                disabled={printingId === doc.id}
                                                className="transition-opacity"
                                            >
                                                <Printer className="w-4 h-4 mr-1" />
                                                Imprimir
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
