import {  Baby } from "lucide-react";
import { DeclaracaoMoradorMenorContentPage } from "./content-page";
 import { Suspense } from "react";
import { Loader } from "../../components/loader";
import { DeclaracaoMoradorMenorForm } from "../components/declaracao-morador-menor-form";
 
export default async function Page() {
    const declaracoes = []
    return (

        <div className="w-full">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                        <Baby className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-1">
                            Declaração de Morador Menor de Idade
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Documento para moradores menores de 18 anos
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total de documentos: <span className="font-semibold">{declaracoes.length}</span>
                        </p>
                    </div>
                </div>
                <DeclaracaoMoradorMenorForm />
            </div>
            <Suspense fallback={<Loader />}>
                <DeclaracaoMoradorMenorContentPage />
            </Suspense>
        </div>

    )
}
