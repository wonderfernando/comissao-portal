import { getMyComissao } from "../actions";
import { ComissaoProfileView } from "./ViewCliente";

export default async function Page() {

  const comissao = await getMyComissao();
  console.log(comissao)
  if (!comissao.dados?.[0])
    return <></>
    return (
    <div className="w-full rounded-md">   
        <ComissaoProfileView comissao={comissao.dados?.[0]}/>
    </div>
  )
}