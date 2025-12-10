import { getAllCtgomAction } from "../actions";
import DataTableCtgom from "./data-table-ctgom";


export async function TableCtgom( { className = "" }: { className?: string }) {
 const ctgom = await getAllCtgomAction()
  return (
   <DataTableCtgom className={className} ctgom={ctgom?.dados ?? []} />
  )
}
