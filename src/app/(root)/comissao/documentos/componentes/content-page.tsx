'use client'

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import { useState } from "react"
 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
 import { UploadDocumentoDialog } from "./upload-documento-dialog"
import { Comissao } from "@/app/(root)/comissao-moradores/interface"
import { getFileIcon } from "@/app/(root)/comissao-moradores/components/comp-551"




export function DocumentosComissao({ comissao }: { comissao: Comissao | null }) {
    const [openStatus, setOpenStatus] = useState(false);
    const [valueStatus, setStatus] = useState('');

    function changeStatus(status: string) {
        setStatus(status);
        setOpenStatus(true);
    }
    function preview(url: string) {
        window.open(url, '_blank');
    }
    return (
        <Card className="w-full ">
            <div className="p-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Documentos</h2>
                    <p className="text-sm text-muted-foreground">Gerencie os documentos da comissão</p>
                </div>
                {comissao?.id && <UploadDocumentoDialog comissaoId={comissao.id} />}
            </div>
            <Separator />
            <CardContent className="w-full grid grid-cols-1 gap-6 pt-6">
                <div className="bg-background overflow-hidden rounded-md border">
                    <Table className="w-full ">
                        <TableHeader className="text-xs">
                            <TableRow className="bg-muted/50">
                                <TableHead className="h-9 py-2">Nome</TableHead>
                                <TableHead className="h-9 py-2">Tipo de ficheiro</TableHead>
                                <TableHead className="h-9 py-2">Criação</TableHead>
                                <TableHead className="h-9 w-0 py-2 text-right">
                                    Acções
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-[13px] ">
                            {comissao?.documento && comissao?.documento?.length > 0 ? (
                                comissao.documento.map((doc: any) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="max-w-48 py-2 font-medium">
                                            <span className="flex items-center gap-2">
                                                <span className="shrink-0">{getFileIcon("")}</span>{" "}
                                                <span className="truncate">{doc.nome}</span>
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-2 text-muted-foreground">
                                            {doc.tipo}
                                        </TableCell>
                                        <TableCell className="py-2 text-muted-foreground">
                                            {new Date(doc.created_at?.split("T")?.[0]).toLocaleDateString('pt-PT', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                        </TableCell>
                                        <TableCell className="py-2 text-right whitespace-nowrap">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="cursor-pointer size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
                                                onClick={() => preview(`${doc.url_ficheiro}`)}
                                            >
                                                <DownloadIcon className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))


                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-muted-foreground text-center py-8">
                                        Nenhum documento carregado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>


            <Separator className="my-6" />

        </Card>
    )
}