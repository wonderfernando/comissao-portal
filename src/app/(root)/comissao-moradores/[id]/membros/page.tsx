
 import { getOneComissaoAction } from "../../actions";
import { ContentPageMembros } from "./components/ContentPage";

export default async function Page({params}: {params: Promise<{id:string}>}) {
  const param =  await params;
  const id = Number(param.id);
  console.log(id)
    const comissao = await getOneComissaoAction(id)
  return (
    <div className="w-full ">   
     <ContentPageMembros mandatos={comissao?.dados?.mandato ?? []} />
    </div>
  )
}