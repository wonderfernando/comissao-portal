import { getComissaoAction } from "../actions"
import TableComissao from "./table-comissao"

export async function ContentPage() {
    const comissoes = await getComissaoAction()
    return ( <TableComissao comissoes={comissoes.dados} className="bg-zinc-50" /> )
}