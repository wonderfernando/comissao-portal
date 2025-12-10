import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Edit2, Settings2, Trash2 } from "lucide-react"
import { Forum } from "../interface"

interface Props {
    editAction: (forum: Forum | null) => void,
    deleteAction: (forum: Forum | null) => void,
    forum: Forum | null
}
export function ActionsTable({ deleteAction, editAction, forum }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="default"
                    className="sm" size={"sm"}
                ><Settings2 size={14} /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => editAction(forum)}><Edit2 size={14} /> Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => deleteAction(forum)}><Trash2 className="text-red-900" /> Cancelar</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}