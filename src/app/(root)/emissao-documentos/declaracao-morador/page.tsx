import { FileText, Plus } from "lucide-react";
import { DeclaracaoMoradorContentPage } from "./content-page";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Loader } from "../../components/loader";
import { DeclaracaoMoradorForm } from "../components/declaracao-morador-form";

export default async function page() {
    
    return (

        <div className="w-full">
                {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-1">
                            Declaração de Morador
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Documento que comprova residência no bairro
                        </p>
                     
                    </div>
                </div>
                <DeclaracaoMoradorForm/>
            </div>
             <Suspense fallback={<Loader/>}>
                <DeclaracaoMoradorContentPage />
             </Suspense>
        </div>
       
    )
}