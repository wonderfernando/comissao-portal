
import { getDeclaracoesMoradorAction } from "../actions";
import { DeclaracaoMoradorForm } from "../components/declaracao-morador-form";
import { DocumentsTable } from "../components/documents-table";

export async function DeclaracaoMoradorContentPage() {
    const documents = await getDeclaracoesMoradorAction()
    return (
        <div className="w-full">
            <DocumentsTable documents={documents.documents} />
        </div>
    );
}
