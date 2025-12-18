import { verificarDocumentoAction } from "./actions";
import LoadingVerification from "./loading-verification";
import { Suspense } from "react";
import { Metadata } from "next";
import DocumentoVerificadoCard from "./documento-verificado-card";

interface PageProps {
    params: {
        hash: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return {
        title: "Verificação de Documento | Sistema de Gestão",
        description: "Verifique a autenticidade de documentos emitidos através do QR Code",
        robots: "noindex, nofollow", // Prevent indexing of verification pages
    };
}

export default async function VerificarDocumentoPage({ params }: PageProps) {
    const { hash } = params;
    const resultado = await verificarDocumentoAction(hash);
console.log(resultado)
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Suspense fallback={<LoadingVerification />}>
                    <DocumentoVerificadoCard resultado={resultado} hash={hash} />
                </Suspense>
            </div>
        </div>
    );
}
