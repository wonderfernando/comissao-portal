import { getMyComissao } from "../actions";
import { ComissaoProfileView } from "./ViewCliente";

export default async function Page() {

  const comissao = await getMyComissao();
  console.log(comissao)
  if (!comissao.dados)
    return <></>
    return (
    <div className="w-full rounded-md">   
        <ComissaoProfileView comissao={comissao?.dados?.comissao}/>
    </div>
  )
}