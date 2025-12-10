import { Button } from "@/components/ui/button";
import AccordionComponent from "./accordion";
import { Separator } from "@/components/ui/separator";
import { SaveComissaoDialog } from "./dialog-save-mandato";
import { Mandato } from "../../../interface";


export function ContentPageMembros({ mandatos }: { mandatos: Mandato[] }) {
    return (
        <div className="w-full rounded-md p-8 bg-white  shadow-sm">
            <div className="flex items-center mb-4 justify-end">
                <SaveComissaoDialog>
                    <Button size={"sm"} className="cursor-pointer">Adicionar mandato</Button>
                </SaveComissaoDialog>
            </div>
            <Separator className="mb-4" />
            <AccordionComponent mandatos={mandatos} />
        </div>
    )
}