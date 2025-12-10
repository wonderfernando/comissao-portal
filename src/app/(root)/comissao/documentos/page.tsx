 import { getMyComissao } from "../../actions";
import { DocumentosComissao } from "./componentes/content-page";

export default async function Page() {
 
  const comissao = await getMyComissao();
  if (!comissao.dados?.[0])
    return <></>
  return (
    <div className="w-full rounded-md">   
        <DocumentosComissao comissao={comissao?.dados?.[0]} />
    </div>
  )
}