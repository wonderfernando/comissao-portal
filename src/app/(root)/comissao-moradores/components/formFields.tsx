"use client"
import {

    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { ComissaoFormValues } from "../interface"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SelectWithSearch from "./Select"
import { useQuery } from "@tanstack/react-query"
import { getAllProvincias } from "../actions"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
export function FormFields() {
    const form = useFormContext<ComissaoFormValues>()
    const { data, isFetching } = useQuery({
        queryKey: ['provincias'],
        initialData: [],
        queryFn: getAllProvincias
    })
    const [provincia, setProvincia] = useState<number | null>(null)
    const [municipio, setMunicipio] = useState<number | null>(null)
    const [comuna, setComuna] = useState<number | null>(null)
    const [_, setBairro] = useState<number | null>(null)


    function getMunicipios(provinciaId: number | null) {
        return data?.find((provincia) => provincia?.id === provinciaId)?.municipio || []
    }

    function getComunas(municipioId: number | null) {
        const municipios = data?.flatMap((provincia) => provincia?.municipio) || []
        return municipios.find((municipio) => municipio?.id === municipioId)?.comuna || []
    }

    console.log("municipio ", data)
    function getBairros(comunaId: number | null) {
        const comunas = data?.flatMap((provincia) => provincia?.municipio?.flatMap((municipio) => municipio?.comuna)) || []
        return comunas.find((comuna) => comuna?.id === comunaId)?.bairro || []
    }
    function onChangeProvincia(value: string) {
        setProvincia(Number(value))
    }

    function onChangeMunicipio(value: string) {
        setMunicipio(Number(value))
    }
    function onChangeComuna(value: string) {
        setComuna(Number(value))
    }

    function onChangeBairro(value: string) {
        setBairro(Number(value))
        form.setValue("bairro_id", Number(value), { shouldValidate: true })
    }

    return (<div className="flex flex-col gap-4 p-1">
        <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Designação da comissão</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage>{form.formState.errors.nome?.message}</FormMessage>
                </FormItem>
            )}
        />
        <div className="grid grid-cols-2 gap-2">

            <div>
                <Label className="font-semibold mb-2">Província</Label>
                <SelectWithSearch onChange={onChangeProvincia} isLoading={isFetching} resource="província" data={data.map((provincia) => ({ id: provincia.id, name: provincia.nome }))} />
            </div>
            <div>
                <Label className="font-semibold mb-2">Município</Label>
                <SelectWithSearch onChange={onChangeMunicipio} isLoading={isFetching}
                    resource="Municipio"
                    data={
                        getMunicipios(provincia).map(mun => ({ id: mun.id, name: mun.nome }))
                    }
                />
            </div>

            <div>
                <Label className="font-semibold mb-2">Distrito/Comuna</Label>
                <SelectWithSearch onChange={onChangeComuna} isLoading={isFetching} resource="Comuna" data={
                    getComunas(municipio).map(comuna => ({ id: comuna.id, name: comuna.nome }))
                } />
            </div>
            <div>
                <FormField
                    control={form.control}
                    name="bairro_id"
                    render={() => (
                        <FormItem className="">
                            <Label className="font-semibold ">Bairro</Label>
                            <FormControl>
                                <SelectWithSearch onChange={onChangeBairro} isLoading={isFetching} resource="Bairro" data={
                                    getBairros(comuna).map(bairro => ({ id: bairro.id, name: bairro.nome }))
                                } />
                            </FormControl>
                            <FormMessage>{form.formState.errors.bairro_id?.message}</FormMessage>
                        </FormItem>
                    )}
                />
            </div>
        </div>

        <FormField
            control={form.control}
            name="delimitacao_geografica"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Delimitação Geográfica</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage>{form.formState.errors.delimitacao_geografica?.message}</FormMessage>
                </FormItem>
            )}
        />

         <FormField
            control={form.control}
            name="ambito_territorial"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Âmbito Territorial</FormLabel>
                    <FormControl>
                        <Select {...field} value={field.value || ""} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione a delimitação geográfica" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Rua">Rua</SelectItem>
                                <SelectItem value="Edificio">Edifício</SelectItem>
                                <SelectItem value="Quarteirao">Quarteirão</SelectItem>
                                <SelectItem value="Bairro">Bairro</SelectItem>
                                <SelectItem value="Aldeia">Aldeia</SelectItem> 
                                <SelectItem value="Povoacao">Povoação</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormControl>
                            <FormMessage>{form.formState.errors.ambito_territorial?.message}</FormMessage>
                        </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="localizacao"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage>{form.formState.errors.delimitacao_geografica?.message}</FormMessage>
                </FormItem>
            )}
        />

        <div className="grid grid-cols-2 gap-2">

            <FormField
                control={form.control}
                name="contacto"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage>{form.formState.errors.contacto?.message}</FormMessage>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                    </FormItem>
                )}
            />
        </div>



    </div>)
}