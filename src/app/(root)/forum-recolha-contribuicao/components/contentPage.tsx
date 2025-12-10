import { getAllForumContribuicoesAction } from "../actions";
import {DataTableForum} from "./data-table-forum";


export async function TableForumContribuicao( { className = "" }: { className?: string }) {
 const contribuicoes = await getAllForumContribuicoesAction()
  return (
   <DataTableForum className={className} contribuicoes={contribuicoes.dados} />
  )
}
