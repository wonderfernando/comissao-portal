import { getForumById } from "../../actions";
import { RelatorioFinanceiroView } from "./view-relatorio-financeiro";
export default async function RelatorioFinanceiroPage({ params }: { params: { id: string } }) {
    const forum = await getForumById(Number(params.id));
    return <RelatorioFinanceiroView dados={forum.dados} />;
}
