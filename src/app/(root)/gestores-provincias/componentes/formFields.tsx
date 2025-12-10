"use client"

import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useFormContext } from "react-hook-form"
import { getAllProvincias } from "../actions"
import { useQuery } from "@tanstack/react-query"
import SelectWithSearch from "../../ctgom/components/Select"
import { Label } from "@/components/ui/label"
import { AdminFormValues } from "../schema"

export function FormFields() {
    const { control,setValue, ...form } = useFormContext<AdminFormValues>()
    const { data, isFetching } = useQuery({
        queryKey: ['provincias'],
        initialData: [],
        queryFn: getAllProvincias
    })


    function onChangeNaturalidade(value: string) {
       setValue("natural_id", Number(value))
    }

    function onChangeProvincia(value: string) {
       setValue("provincia_id", Number(value))
    }


    return (
        <div className="">
            <fieldset className="mb-6 border rounded-md">
                <legend className="text-md font-semibold  ">Dados pessoais</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 ">
                    <FormField
                        control={control}
                        name="nome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome completo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="telefone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Telefone" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="bi"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>BI</FormLabel>
                                <FormControl>
                                    <Input placeholder="Número do BI" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="data_nascimento"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data de Nascimento</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="genero"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gênero</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o gênero" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="masculino">Masculino</SelectItem>
                                            <SelectItem value="feminino">Feminino</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        )}
                    />
                    <div>
                        <Label className="font-semibold mb-2">Naturalidade</Label>
                        <SelectWithSearch 
                            onChange={onChangeNaturalidade} 
                            isLoading={isFetching} 
                            resource="província" 
                            data={data.map((provincia) => 
                                ({ id: provincia.id, name: provincia.nome }))} 
                            />
                    </div>
                </div>
            </fieldset>

            <div>
                <Label className="font-semibold mb-2">Província de gestão</Label>
                <SelectWithSearch onChange={onChangeProvincia} isLoading={isFetching} resource="província" data={data.map((provincia) => ({ id: provincia.id, name: provincia.nome }))} />
            </div>

        </div>
    )
}
