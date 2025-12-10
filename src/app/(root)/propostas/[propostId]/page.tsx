import {  getPropostaByIdAdminsAction } from "../../ctgom/actions";
import { PropostaView } from "../componentes/ContentPage";

export default async function Page({ params }: { params: Promise<{ propostId: string }>}) {
  const param = await params;
  const proposta = await getPropostaByIdAdminsAction(Number(param.propostId));
 
  console.log("proposta ",proposta)
  if (!proposta?.proposta) return <></>
     return (
    <div className="w-full rounded-md">   
        <PropostaView proposta={proposta?.proposta} />
    </div>
  )
}