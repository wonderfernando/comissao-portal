"use server"

import { getAuth } from "../auth";
import { Projeto } from "../projetos/interface";

export async function getProjetoByIdAction(id: number): Promise<{ success: boolean; projeto: Projeto }> {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projeto/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
        throw new Error("Erro ao buscar projeto")
    }
    return response.json();
}
