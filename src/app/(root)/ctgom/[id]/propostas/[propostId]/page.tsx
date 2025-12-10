import { getPropostaByIdAction } from "../../../actions";
import { PropostaView } from "../componentes/ContentPage";

export default async function Page({ params }: { params: Promise<{ id: string, propostId: string }>}) {
  const {  propostId, id } = await params;
  const proposta = await getPropostaByIdAction({id: propostId ? Number(propostId) : 0, ctgom_id: id ? Number(id) : 0});
  if (!proposta.projeto) return <></>
  return (
    <div className="w-full rounded-md">   
        <PropostaView proposta={proposta.projeto} />
    </div>
  )
}