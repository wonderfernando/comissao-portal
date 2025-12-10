"use server"

import { revalidatePath } from "next/cache";
import { getAuth } from "../auth";
import { Comissao, Provincia } from "./interface";


export async function getAllProvincias(): Promise<Provincia[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/provincia`);
    if (!response.ok && response.status != 404) {
        throw new Error("Erro ao buscar as provincias")
    }
    const data = await response.json();
    return data?.dados
}

export async function getComissaoAction(): Promise<{ success: boolean; message: string; dados: Comissao[]; }> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comissao/morador`, {
        headers: {
            ...(await getAuth()),
            "Content-Type": "application/json"
        }
    })

    if (!res.ok && res.status != 404) {
        return { success: false, message: "Erro ao buscar as comissões de moradores", dados: [] };
    }
    const json = await res.json()
    return json
}


export async function getOneComissaoAction(id: number): Promise<{ success: boolean; message: string; dados: Comissao | null }> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comissao/morador/${id}`, {
        headers: {
            ...(await getAuth()),
            "Content-Type": "application/json"
        }
    })

    if (!res.ok && res.status != 404) {
        return { success: false, message: "Erro ao buscar as comissões de moradores", dados: null };
    }
    const json = await res.json()
    return json
}


export async function saveComissaoMoradores(data: any): Promise<{ success: boolean, mensagem: string }> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comissao/morador`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        return await response.json()
    }
    console.log(`sucesso: ${await response.text()}`)
    revalidatePath('/comissao-moradores');
    return await response.json()
}


export async function updateStateComissaoMoradores({ state, id }: { state: string, id: string }): Promise<{ success: boolean, message: string }> {
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/comissao/morador/${id}/${state}`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comissao/morador/${state}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        }
    })
    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
        return { success: false, message: "Erro ao salvar o estado da comissão de moradores" };
    }
    const json = await response.json() 
    revalidatePath('/comissao-moradores');
    return json;
}


export async function saveMandatoAction(data: any){
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comissao/morador/membros`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        return await response.json()      
    }
    revalidatePath('/comissao-moradores');
    return await response.json();
}


export async function uploadDocumentoComissao({id, data}: {id: string, data: any}): Promise<{ success: boolean, message: string }> {
    console.log(id, data)
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comissao/morador/atualizar/documento/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(await getAuth())
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const errorText = await response.text();
            console.log(`Erro: ${errorText}`)
            return { success: false, message: "Erro ao fazer upload do documento" };
        }

        const result = await response.json();
        console.log(`Sucesso: ${JSON.stringify(result)}`)
        revalidatePath('/comissao-moradores');
        return { success: true, message: "Documento adicionado com sucesso" };
    } catch (error) {
        console.error("Erro ao fazer upload:", error);
        return { success: false, message: "Erro ao fazer upload do documento" };
    }
}

export async function getPdf(url: string): Promise<Blob | null>
{
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/${url}`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`,{
        method:"GET",
        headers: {            
            ...(await getAuth())
        }
    })
    if (!response.ok)
    {
        console.log("Erro:")
        console.log(await response.text())
        return null
    }

    console.log("Sucesso")
    return await response.blob()
}