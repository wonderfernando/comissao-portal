import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MembroComissao } from "../../../interface";
import { Badge } from "@/components/ui/badge";

export function functionMember(value: string){
    switch(value){
        case "presidente":
            return "Presidente";
        case "coordenador_adjunto":
            return "Vice-Presidente";
        case "secretario":
            return "Secretário";
        case "normal":
            return "Membro";
    }
}

export function TableMembers({ members }: { members?: MembroComissao[] }) {
    return (
        <Table className="">
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Estado</TableHead>
                </TableRow>
                </TableHeader >
                <TableBody>

                    {members && members.map((member) => (
                        <TableRow key={member?.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarFallback>{member?.user_membro?.nome.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{member?.user_membro?.nome}</TableCell>
                            <TableCell>{member?.user_membro?.email}</TableCell>
                            <TableCell>{functionMember(member?.funcao)}</TableCell>
                            <TableCell>{member?.ativo === 1 ? <Badge>Activo</Badge> : <Badge>Inactivo</Badge>}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>

        </Table>
    )
}