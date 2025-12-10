'use client'

import {
    Card,

    CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { Button } from "@/components/ui/button"

import { DownloadIcon } from "lucide-react"
 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getFileIcon } from "@/app/(root)/comissao-moradores/components/comp-551"
import { Documento } from "../../../interface"
 



export function DocumentosMandato({ documentos }: { documentos: Documento[]  }) {
     function preview(url: string) {
        window.open(url, '_blank');
    }
    return (
        <Card className="w-full ">
            <CardContent className="w-full grid grid-cols-1  gap-6 ">
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
                            {documentos && documentos.length > 0 ? (
                                documentos.map((doc: any, index) => (
                                    <TableRow key={`${doc.name}-${index}`}>
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
                                                //    aria-label={`Download ${file.file.name}`}
                                                onClick={() => preview(`${doc.url_ficheiro}`)}
                                            >
                                                <DownloadIcon className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))


                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-muted-foreground text-center">
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