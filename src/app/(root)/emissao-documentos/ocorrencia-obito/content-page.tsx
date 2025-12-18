import { OcorrenciaObitoForm } from "../components/ocorrencia-obito-form";
import { DocumentsTable } from "../components/documents-table";
import { getOcorrenciasObitoAction } from "../actions";
import { getCurrentUser } from "../../auth";

export async function OcorrenciaObitoContentPage() {
    const documents = await getOcorrenciasObitoAction();
    const userCurrent = await getCurrentUser();

    return (
        <div className="w-full space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Ocorrências de Óbito</h2>
                <OcorrenciaObitoForm presidente={userCurrent?.nome}/>
            </div>
            <DocumentsTable documents={documents.documents} />
        </div>
    );
}
