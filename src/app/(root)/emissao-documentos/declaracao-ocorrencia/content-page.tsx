import { DeclaracaoOcorrenciaForm } from "../components/declaracao-ocorrencia-form";
import { DocumentsTable } from "../components/documents-table";
import { getDeclaracaoOcorrenciaAction } from "../actions";

export async function DeclaracaoOcorrenciaContentPage() {
    const documents = await getDeclaracaoOcorrenciaAction();

    return (
        <div className="w-full space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Declarações de Ocorrência</h2>
                <DeclaracaoOcorrenciaForm />
            </div>
            <DocumentsTable documents={documents.documents} />
        </div>
    );
}
