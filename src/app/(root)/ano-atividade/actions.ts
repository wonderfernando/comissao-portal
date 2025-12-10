"use server";

import { revalidatePath } from "next/cache";
import { getAuth } from "../auth";
import { Ano } from "./interface";

export async function getAnoAtividadeAction() : Promise<{success: boolean,dados: Ano[], message: string}> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ano_forum`,{
        headers: {
            'Content-Type': 'application/json',
            ...(await getAuth())
        },
    });
    if (!response.ok) {
        console.log("Erro ao buscar anos de actividade:", await response.text());
        return {success: false, dados: [], message: 'Erro ao buscar anos de actividade'};
    }
    const data = await response.json();
    return data;
}


export async function getAnoSAtividadesAction() : Promise<{success: boolean,dados: Ano[], message: string}> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ano_forum_all`,{
        headers: {
            'Content-Type': 'application/json',
            ...(await getAuth())
        },
    });
    if (!response.ok) {
        console.log("Erro ao buscar anos de actividade:", await response.text());
        return {success: false, dados: [], message: 'Erro ao buscar anos de actividade'};
    }
    const data = await response.json();
    console.log(data)
    return data;
}

export async function saveAnoAtividadeAction(ano: any) : Promise<{success: boolean,dados: any, message: string}> {
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ano_forum`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(await getAuth())
        },
        body: JSON.stringify(ano),
    });
    if (!response.ok) {
        console.log("Erro ao salvar ano de actividade:", await response.text());
        return {success: false, dados: null, message: 'Erro ao salvar ano de actividade'};
    }
    revalidatePath('/ano-atividade');
    const data = await response.json();
    return data;
}