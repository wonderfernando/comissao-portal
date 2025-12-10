
import { getAllPropostasAction } from "../actions";
import { getCurrentUser } from "../auth";
import { PropostasView } from "./ViewPropostas";
 

export default async function Page({ params }: { params: Promise<{ id: string }>}) {
 
 const propostas = await getAllPropostasAction();

 const userData = await getCurrentUser();

 
  return (
    <div className="w-full rounded-md">   
        <PropostasView tipo={userData?.tipo || null} propostas={propostas?.proposta || []} />
    </div>
  )
}