
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getAllDocumentsAction } from "./actions";
import { DocumentsTable } from "./components/documents-table";

export default async function EmissaoDocumentosPage() {
    const result = await getAllDocumentsAction();
    const documents = result.success ? result.documents : [];

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="font-semibold text-3xl mb-2">Emissão de Documentos</h1>
                <p className="text-muted-foreground">
                    Gerencie e emita documentos oficiais da comissão de moradores
                </p>
            </div>

            <Suspense fallback={
                <div className="w-full h-[50vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Carregando documentos...</p>
                    </div>
                </div>
            }>
                <DocumentsTable documents={documents} />
            </Suspense>
        </div>
    );
}