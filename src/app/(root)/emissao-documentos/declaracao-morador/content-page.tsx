
import { getDeclaracoesMoradorAction } from "../actions";
import { DocumentsTable } from "../components/documents-table";

export async function DeclaracaoMoradorContentPage() {
    const documents = await getDeclaracoesMoradorAction()
    console.log("page: ", documents)
    return (
        <div className="w-full">
            <DocumentsTable documents={documents.documents} />
        </div>
    );
}
