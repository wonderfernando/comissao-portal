import { getOneCtgomActio } from "../../actions";
import { ContentPageDocuments } from "./components/ContentPage";

 export default async function Page({params}: { params: Promise<{ id: string }>}) {
       const {id} = await params;
     const ctgom = await getOneCtgomActio(Number(id));
    return (
        <div>
            <ContentPageDocuments documents={ctgom.dados.mandato.flatMap(m=>m.documentos)} />
        </div>
  );
}
