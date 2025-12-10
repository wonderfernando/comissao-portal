import { getPropostaByIdAction } from "../../../actions";
import { PropostaView } from "../componentes/ContentPage";

export default async function Page({ params }: { params: Promise<{ id: string, propostId: string }>}) {
  const {  propostId } = await params;
  const proposta = await getPropostaByIdAction(propostId ? Number(propostId) : 0);
  return (
    <div className="w-full rounded-md">   
        <PropostaView proposta={proposta.dados} />
    </div>
  )
}