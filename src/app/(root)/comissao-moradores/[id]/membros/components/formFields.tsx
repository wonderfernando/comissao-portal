"use client"
import {

    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { useFieldArray, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MandatoForm } from "../../../interface"

export function FormFields() {
    const form = useFormContext<MandatoForm>()

    return (
        <div className="flex flex-col gap-4  p-4"
        onClick={(e) => e.stopPropagation()}
        >


            <div className="grid grid-cols-2 gap-2 ">
                <FormField
                    control={form.control}
                    name="data_inicio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data Início</FormLabel>
                            <FormControl><Input className="w-full" type="date" {...field} value={
                                field.value ? new Date(field.value).toISOString().substring(0, 10) : ''
                            } />
                            </FormControl>
                            <FormMessage>{form.formState.errors.data_inicio?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data_fim"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data Final</FormLabel>
                            <FormControl><Input className="w-full" type="date" {...field} value={
                                field.value ? new Date(field.value).toISOString().substring(0, 10) : ''
                            } />
                            </FormControl>
                            <FormMessage>{form.formState.errors.data_fim?.message}</FormMessage>
                        </FormItem>
                    )}
                />
            </div>
            <Separator />
            <div>
                <Label>Membros</Label>
                <MembrosAdd />
            </div>

        </div>
    )
}


export function MembrosAdd() {

    const { control, formState: { errors } } = useFormContext<MandatoForm>()
    const { fields, append, remove } = useFieldArray({
        control,
        name: "membros"
    })
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`membros.${index}.nome`}
                                    render={({ field }) => (
                                        <FormItem className="m-0">
                                            <FormControl><Input className="w-full" {...field} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`membros.${index}.funcao`}
                                    render={({ field }) => (
                                        <FormItem className="m-0">
                                            <FormControl>
                                                <Select
                                                onValueChange={field.onChange}
                                                    {...field}
                                                  
                                                >
                                                    <SelectTrigger className={`${errors?.membros?.[index]?.funcao ? "border-red-500" : ""} border `}>
                                                        <SelectValue className="w-full" placeholder="Função" />
                                                    </SelectTrigger>
                                                    <SelectContent className="w-full">
                                                        <SelectItem value="presidente">Presidente</SelectItem>
                                                        <SelectItem value="coordenador_adjunto">Vice Presidente</SelectItem>
                                                        <SelectItem value="secretario">Secretário</SelectItem>
                                                        <SelectItem value="normal">Membro</SelectItem>
                                             
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`membros.${index}.contacto`}
                                    render={({ field }) => (
                                        <FormItem className="m-0">
                                            <FormControl><Input className="w-full" {...field} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`membros.${index}.email`}
                                    render={({ field }) => (
                                        <FormItem className="m-0">
                                            <FormControl><Input className="w-full" {...field} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                            </TableCell>

                            <TableCell>
                                <Button variant={"outline"} className=" text-white" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4 text-zinc-800" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>

            </Table>
            <Button size={"sm"} className="mt-4" type="button" onClick={() => append({
                nome: '',
                funcao: '',
                contacto: '',
                email: '',
            })}>
                Adicionar Membro
            </Button>
        </div>

    )
}