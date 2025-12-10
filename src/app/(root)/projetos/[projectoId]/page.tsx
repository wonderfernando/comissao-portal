import { getProjetoByIdAction } from "../../ctgom/getProjetoById";

import { ProjetoView } from "../componentes/ContentPage";

export default async function Page({ params }: { params: Promise<{ projectoId: string }> }) {
    const param = await params;
    const projeto = await getProjetoByIdAction(Number(param.projectoId));
    console.log(param.projectoId);
    console.log(projeto)
    return (
        <div className="w-full rounded-md">
            <ProjetoView projeto={projeto?.projeto} />
        </div>
    )
}
