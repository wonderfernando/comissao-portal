
import { getMyComissao } from "../../actions";
import { ContentPageMembros } from "./components/ContentPage";

export default async function Page() {
  const comissao = await getMyComissao();
  if (!comissao.dados?.[0])
    return <></>
  return (
    <div className="w-full ">
      <ContentPageMembros mandatos={comissao?.dados?.[0].mandato ?? []} />
    </div>
  )
}