import { getAllAdminProvinciaUsers } from "../actions";
import DataTableAdmin from "./table";
 

export async function ContentViewAdmin( { className = "" }: { className?: string }) {
 const users = await getAllAdminProvinciaUsers()
  return (
   <DataTableAdmin className={className} users={users.dados} />
  )
}
