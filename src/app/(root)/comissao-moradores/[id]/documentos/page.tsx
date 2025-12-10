import { getOneComissaoAction } from "../../actions";
import { DocumentosComissao } from "./componentes/content-page";


export default async function Page({params}: {params: Promise<{id:string}>}) {
  const param =  await params;
  const id = Number(param.id);
  console.log(id)
    const comissao = await getOneComissaoAction(id)
  return (
    <div className="w-full rounded-md">   
        <DocumentosComissao comissao={comissao?.dados} />
    </div>
  )
}