import { getDeclaracoesMoradorMenorAction } from "../actions";
 import { DocumentsTable } from "../components/documents-table";

export async function DeclaracaoMoradorMenorContentPage() {
    const documents = await getDeclaracoesMoradorMenorAction();

    return (
        <div className="w-full space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Declarações de Menores</h2>
            </div>
            <DocumentsTable documents={documents.documents} />
        </div>
    );
}
