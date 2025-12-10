
import { getAllProjectosAction } from "../actions";
import { ProjectosView } from "./ViewProjectos";



export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const projetos = await getAllProjectosAction();
    return (
        <div className="w-full rounded-md">
            <ProjectosView projetos={projetos?.projeto || []} />
        </div>
    )
}
