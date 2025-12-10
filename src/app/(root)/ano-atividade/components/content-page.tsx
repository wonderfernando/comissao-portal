import {  getAnoSAtividadesAction } from "../actions";
import TableYear from "./table-year";

export async function ContentPage() {
    const ano = await getAnoSAtividadesAction();
    return (
        <TableYear ano={ano.dados} />
    )
}