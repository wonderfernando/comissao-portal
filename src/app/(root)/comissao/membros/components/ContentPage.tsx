import { Button } from "@/components/ui/button";
import AccordionComponent from "./accordion";
import { Separator } from "@/components/ui/separator";
import { SaveComissaoDialog } from "./dialog-save-mandato";
import { Mandato } from "@/app/(root)/comissao-moradores/interface";
 

export function ContentPageMembros({ mandatos }: { mandatos: Mandato[] }) {
    return (
        <div className="w-full rounded-md p-8 bg-white  shadow-sm">
            <AccordionComponent mandatos={mandatos} />
        </div>
    )
}