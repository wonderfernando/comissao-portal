import Link from "next/link";
import { Anexo } from "../../../interface";
import { Eye } from "lucide-react";

interface Actas {
    id: number;
    titulo: string;
    data: string;
    documento: string;
    descricao: string;
}
export default function ActasComponent({ actas }: { actas: Anexo[] }) {
    console.log(actas)
    return (
        <div className="w-full rounded-md p-8">
            {actas?.map((acta) => (
                <div key={acta.id} className="mb-4">
                    <h3 className="text-lg font-semibold">{"Acta"}</h3>
                    <p className="text-sm text-gray-500">{acta?.tipo}</p>
                    <p className="text-sm text-gray-500">{acta?.created_at?.split("T")?.[0]}</p>
                    <Link target="_blank" href={acta?.url_ficheiro} className="text-blue-500 hover:underline flex items-center gap-1">
                        Visualizar <Eye size={14}/>
                    </Link>
                </div>
            ))}
        </div>
    )

}
