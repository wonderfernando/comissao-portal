import { getAllForumPrestacaoAction } from "../actions";
import {DataTableForum} from "./data-table-forum";


export async function TableForumContribuicao( { className = "" }: { className?: string }) {
 const contribuicoes = await getAllForumPrestacaoAction()
  return (
   <DataTableForum className={className} contribuicoes={contribuicoes.dados} />
  )
}
