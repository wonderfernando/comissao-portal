
import { getOneCtgomActio } from "../../actions";
import { ContentPageMembros } from "./components/ContentPage";

export default async function Page({params}: { params: Promise<{ id: string }>}) {
  const {id} = await params;
  const ctgom = await getOneCtgomActio(Number(id));
  return (
    <div className="w-full ">   
      <ContentPageMembros mandatos={ctgom.dados.mandato || []} />
    </div>
  )
}