"use client"
import {

    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { CtgomFormValues } from "../interface"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SelectWithSearch from "./Select"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getAllProvincias } from "../../actions"
export function FormFields() {
    const form = useFormContext<CtgomFormValues>()
    const { data, isFetching } = useQuery({
        queryKey: ['provincias'],
        initialData: [],
        queryFn: getAllProvincias
    })
    const [provincia, setProvincia] = useState<number | null>(null)

    function getMunicipios(provinciaId: number | null) {
        return data?.find((provincia) => provincia.id === provinciaId)?.municipios || []
    }


    function onChangeProvincia(value: string) {
        setProvincia(Number(value))
    }

    function onChangeMunicipio(value: string) {
        form.setValue("municipio_id", Number(value), { shouldValidate: true } )
    }


    return (
        <div className="flex flex-col gap-4">

            <div className="grid grid-cols-2 gap-2">

                <div>
                    <Label className="font-semibold mb-2">Província</Label>
                    <SelectWithSearch onChange={onChangeProvincia} isLoading={isFetching} resource="província" data={data.map((provincia) => ({ id: provincia.id, name: provincia.nome }))} />
                </div>
                <div>
                
                    <FormField
                        control={form.control}
                        name="municipio_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Municipio</FormLabel>
                                <FormControl>
                                    <SelectWithSearch onChange={onChangeMunicipio} isLoading={isFetching}
                                        resource="Municipio"
                                        data={
                                            getMunicipios(provincia).map(mun => ({ id: mun.id, name: mun.nome }))
                                        }
                                    />
                                </FormControl>
                                <FormDescription>Selecione primeiro a província</FormDescription>
                                <FormMessage>{form.formState.errors.municipio_id?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">

                <FormField
                    control={form.control}
                    name="localizacao"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Localização</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage>{form.formState.errors.localizacao?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="ano"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ano de criacao</FormLabel>
                            <FormControl>
                                <Input type="date" value={
                                    field.value ? new Date(field.value).toISOString().split('T')[0] : ''
                                } onChange={(e) => {field.onChange(new Date(e.target.value).toISOString().split('T')[0])}} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.ano?.message}</FormMessage>
                        </FormItem>
                    )}
                />
            </div>

        </div>)
}