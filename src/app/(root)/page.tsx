import { getAllProjectosAction } from "./actions";
import { getComissaoAction } from "./comissao-moradores/actions";
import { DashboardContent } from "./components/dashboard-content";

export default async function DashboardOverview() {
  const projetos = await getAllProjectosAction();
  const comissoes = await getComissaoAction();

  return <DashboardContent projetos={projetos?.projeto || []} comissoes={comissoes?.dados || []} />;
}
