import { getOneComissaoAction } from "../actions";
import { ComissaoProfileView } from "./ViewCliente";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const comissao = await getOneComissaoAction(Number(id));
  return (
    <div className="w-full rounded-md">   
        <ComissaoProfileView comissao={comissao.dados}/>
    </div>
  )
}