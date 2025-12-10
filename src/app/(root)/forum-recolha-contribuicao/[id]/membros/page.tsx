
import { getCtgomMandatosAction } from "../../actions";
import { ContentPageMembros } from "./components/ContentPage";

export default async function Page({params}: { params: Promise<{ id: string }>}) {
  const {id} = await params;
  const mandatos = await getCtgomMandatosAction(Number(id));
  return (
    <div className="w-full ">   
      <ContentPageMembros mandatos={mandatos.dados} />
    </div>
  )
}