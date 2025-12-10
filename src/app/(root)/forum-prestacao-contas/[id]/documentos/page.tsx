import { ContentPageDocuments } from "./components/ContentPage";

export default function DocumentosPage() {
    const documentos = [
        { id: 1, titulo: "Documento 1", data: "2023-01-01", documento: "/documento1.pdf", descricao: "Descrição do Documento 1" },
        { id: 2, titulo: "Documento 2", data: "2023-01-02", documento: "/documento2.pdf", descricao: "Descrição do Documento 2" },
        { id: 3, titulo: "Documento 3", data: "2023-01-03", documento: "/documento3.pdf", descricao: "Descrição do Documento 3" },
    ];
    return (
        <div>
            <ContentPageDocuments documents={documentos} />
        </div>
  );
}
