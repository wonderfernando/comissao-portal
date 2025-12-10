import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {  Trash2Icon } from "lucide-react";
import Link from "next/link";

export interface Documentos {
    id: number;
    titulo: string;
    data: string;
    documento: string;
    descricao: string;
}
interface ContentPageDocumentsProps {
    documents?: Documentos[];
}
export function ContentPageDocuments({ documents }: ContentPageDocumentsProps) {
    return (
        <div className="w-full rounded-md p-8 space-y-4">
          
          <div>
              <Button className="cursor-pointer">Carregar documento</Button>
          </div>
          <Separator />
            <div className="w-full rounded-md">
                {documents && documents.map((doc) => (
                    <div key={doc.id} className="mb-4">
                        <h3 className="text-lg font-semibold">{doc.titulo}</h3>
                        <p className="text-sm text-gray-500">{doc.descricao}</p>
                        <p className="text-sm text-gray-500">{doc.data}</p>
                        <Link href={doc.documento} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                            Visualizar
                        </Link>
                        <Button
                            variant="outline"
                            className="cursor-pointer ml-4 hover:bg-red-900 hover:text-white [&_*]:hover:text-white"
                            size="sm"
                        >
                            Remover <Trash2Icon className="ml-2 text-white" size={14} />
                        </Button>

                    </div>
                ))}
            </div>
        </div>
    )
}