"use server"

import { revalidatePath } from "next/cache";
import { getAuth } from "./auth";
import { Comissao, Provincia } from "./comissao-moradores/interface";
import { UploadResponseDTO } from "./ctgom/interface";
import { DtoResponseCategorias } from "./interface";
import { Proposta, PropostaResponseDTO } from "./propostas/interface";
import { PropostaCreateDTO } from "./propostas/proposta-schema";
import { Projeto } from "./projetos/interface";

export async function getAllProvincias(): Promise<Provincia[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/provincia`);
    if (!response.ok && response.status != 404) {
        throw new Error("Erro ao buscar as provincias")
    }
    const data = await response.json();
    return data?.dados
}

export async function getCategoriasPropostas(): Promise<DtoResponseCategorias> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categoria`);
    if (!response.ok && response.status != 404) {
        return { success: false, dados: [] }
    }
    const data = await response.json();
    return data
}


export async function uploadFilesAction(formData: FormData): Promise<{
    success: boolean,
    uploads: {
        nome: string,
        tipo: "imagem" | "video" | "documento" | "",
        success: boolean,
        caminho: string,
        mensagem: string
    }[]
}> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`,
        {
            method: "POST",
            body: formData,

        })
    if (!response.ok) {
        console.log(await (response.text()))
        return {
            success: false,
            uploads: [{ nome: "", tipo: "", success: false, caminho: "", mensagem: "Erro ao fazer upload" }]
        }
    }
    const data = await response.json();
    return data
}

export async function getAllPropostasAction(): Promise<{
    success: boolean;
    proposta: Proposta[];
}> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposta`, {
        method: "GET",
        headers: {
            ...(await getAuth())
        }
    })
    if (!response.ok && response.status != 404) {
        return { success: false, proposta: [] }
    }
    const data = await response.json();

    return data
}


export async function getAllProjectosAction(): Promise<{
    success: boolean;
    projeto: Projeto[];
}> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projeto`, {
        method: "GET",
        headers: {
            ...(await getAuth())
        }
    })
    if (!response.ok && response.status != 404) {
        return { success: false, projeto: [] }
    }
    const data = await response.json();

    return data
}


export async function getMyComissao(): Promise<{ success: boolean; message: string; dados: Comissao[] | null }> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comissao/morador`, {
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




export async function postPropostaAction(data: PropostaCreateDTO): Promise<{
    success: boolean;
    message: string;
}> {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposta`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        console.log(await response.text())
        return { success: false, message: "Erro ao salvar proposta" }
    }
    revalidatePath('/propostas');
    const json = await response.json();
    return json
}

export async function postStatePropostaAction({ state, id }: { state: string, id: number }): Promise<any> {
    console.log(state, id)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposta/${state}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    })
    if (!response.ok) {
        const json = await response.json()
        return json
    }
    revalidatePath('/propostas');
    const json = await response.json();
    return json
}

export async function postProjetoAction(data: any): Promise<{
    success: boolean;
    message: string;
}> {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projeto`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        console.log(await response.text())
        return { success: false, message: "Erro ao salvar projeto" }
    }
    revalidatePath('/projetos');
    const json = await response.json();
    return json
}

export async function postStateProjetoAction({ state, id }: { state: string, id: number }): Promise<any> {
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/projeto/${state}/${id}`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projeto/${id}/${state}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    })
    if (!response.ok) {
        const ret = await response.text()
        console.log(ret)
        return JSON.parse(ret)
    }
    revalidatePath('/projetos');
    const json = await response.json();
    return json
}

