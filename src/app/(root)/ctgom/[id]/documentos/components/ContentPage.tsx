import { Documento } from "../../../interface";
import { DocumentosMandato } from "../../membros/components/actas";


interface ContentPageDocumentsProps {
    documents?: Documento[];
}
export function ContentPageDocuments({ documents }: ContentPageDocumentsProps) {
    console.log("documents", documents);
    return (
        <div className="w-full rounded-md p-8 space-y-4">
          
        {/*   <div>
              <Button className="cursor-pointer">Carregar documento</Button>
          </div> */}
        <DocumentosMandato documentos={documents || []} />
        </div>
    )
}