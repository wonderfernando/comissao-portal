"use client"
import {

    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"

import { PropostaCreateDTO } from "../../proposta-schema"
import { useQuery } from "@tanstack/react-query"
import { getAllProvincias, getCategoriasPropostas } from "@/app/(root)/actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import SelectWithSearch from "@/app/(root)/comissao-moradores/components/Select"
import { getCurrentUserAllData } from "@/app/(root)/auth"
export function FormFields() {
    const form = useFormContext<PropostaCreateDTO>()
    const { data: categorias } = useQuery({
        queryKey: ['categorias-propostas'],
        queryFn: getCategoriasPropostas
    })
    const { data, isFetching } = useQuery({
        queryKey: ['provincias'],
        initialData: [],
        queryFn: getAllProvincias
    })


    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: getCurrentUserAllData
    })

   useEffect(() => {
        if(user){
            console.log("set muni ", user?.gestor_municipal?.municipio_id?.toString() )
            onChangeMunicipio(user?.gestor_municipal?.municipio_id?.toString() || "")
        }
   }, [user])
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

    console.log("municipio ", user)
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

    return (
        <div className="flex flex-col gap-4">

            <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage>{form.formState.errors.titulo?.message}</FormMessage>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage>{form.formState.errors.descricao?.message}</FormMessage>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="categoria_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                            <Select {...field} value={field.value?.toString()} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categorias?.dados?.map((categoria) => (
                                        <SelectItem key={categoria.id} value={String(categoria.id)}>
                                            {categoria.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-2">
                <FormField
                    control={form.control}
                    name="custo_estimado"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Custo Estimado</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage>{form.formState.errors.custo_estimado?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="localizacao"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Localização</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.localizacao?.message}</FormMessage>
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-2 w-full col-span-2">
                   {
                   (user?.user.tipo !== "admin_municipal") && (
                    <>
                   <div>
                        <Label className="font-semibold mb-2">Província</Label>
                        <SelectWithSearch onChange={onChangeProvincia} isLoading={isFetching} resource="província" data={data.map((provincia) => ({ id: provincia.id, name: provincia.nome }))} />
                    </div>
                    <div>
                        <Label className="font-semibold mb-2">Município</Label>
                        <SelectWithSearch onChange={onChangeMunicipio} isLoading={isFetching}
                            resource="Município"
                            data={
                                getMunicipios(provincia).map(mun => ({ id: mun.id, name: mun.nome }))
                            }
                        />
                    </div>
                    </>
                    )
                    }
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
            </div>


        </div>)
}