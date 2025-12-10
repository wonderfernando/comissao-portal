import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Membro } from "../../../interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";





export function TableMembers({ members }: { members?: Membro[] }) {
    return (
        <Table className="">
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                </TableRow>
                </TableHeader >
                <TableBody>

                    {members && members.map((member) => (
                        <TableRow key={member?.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={member?.imagem} alt={member.nome} />
                                    <AvatarFallback>{member?.user_membro?.nome.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{member?.user_membro?.nome}</TableCell>
                            <TableCell>{member?.user_membro?.email}</TableCell>
                            <TableCell>{member?.funcao}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>

        </Table>
    )
}