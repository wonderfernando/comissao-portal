"use client"
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { getPdf } from "../comissao-moradores/actions";


export function BtnPrint({ url }: { url: string }) {
    async function renderPdf() {
        const response = await getPdf(url)
        if (!response) {
            toast.error("Erro ao gerar PDF.")
            return
        }
        const link = URL.createObjectURL(response)
        window.open(link)
    }
    return <Button onClick={renderPdf} variant={"outline"} size="sm" className="mr-2">Exportar <Download /></Button>

}