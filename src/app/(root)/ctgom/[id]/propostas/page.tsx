import { getPropostaCtgomByIdAction, getPropostasByCtgomAction } from "../../actions";
import { PropostasCtgomView } from "./ViewPropostas";


export default async function Page({ params }: { params: Promise<{ id: string }>}) {
 const {id} = await params;
 
 const propostas = await getPropostaCtgomByIdAction(Number(id));

 console.log("sdasdasdsadd ",propostas)
  return (
    <div className="w-full rounded-md">   
        <PropostasCtgomView propostas={propostas.projeto} />
    </div>
  )
}