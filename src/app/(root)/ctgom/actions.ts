"use server"

import { success } from "zod";
import { getAuth } from "../auth";
import { PropostaCtgom, PropostaOneResponseDTO, PropostaResponseDTO } from "./[id]/propostas/interface";
import { Ctgom, DtoResponseGetAllCtgom, DtoResponseGetCtgom, DtoResponseMandatos } from "./interface";
import { console } from "inspector";
import { Proposta } from "../propostas/interface";


export async function saveCtgomAction(data: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ctgom`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
         
        const json = await response.json();
        return { success: false, message: json.mensagem || "Erro ao salvar a CTGOM"};
    }
    const json = await response.json();
    console.log("Response CTGOM: ", json)
    return json
}

export async function saveMandatoAction(data: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ctgom/membros`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
        return { success: false, message: "Erro ao salvar o mandato" };
     }
    return response.json();
}


export async function getAllCtgomAction(): Promise<DtoResponseGetAllCtgom> {
    // 
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ctgom`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok && response.status !== 404) {
        console.log(`Erro: ${await response.text()}`)
        return { success: false, dados: [] , mensagem: "Erro ao buscar CTGOM"};
    }
    return response.json();
}

export async function getCtgomAction(id: number): Promise<DtoResponseGetCtgom> {
   
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ctgom/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
        return { success: false, dados: {} as Ctgom , mensagem: "Erro ao buscar CTGOM"};
    }
    return response.json();
}

export async function getOneCtgomActio(id: number): Promise<{
    success: boolean; dados: Ctgom; mensagem: string
}> {
   
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ctgom/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok && response.status !== 404) {
        console.log(`Erro: ${await response.text()}`)
        throw new Error("Erro ao buscar CTGOM Mandatos")
    }
    return response.json();
}

export async function getPropostasByCtgomAction(id: number): Promise<PropostaResponseDTO> {
   
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposta/ctgom/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok && response.status !== 404) {
        console.log(`Erro: ${await response.text()}`)
        return {
            success: false,
            dados: [],
            message: "Erro ao buscar propostas"
        }
    }
    return response.json();
}

export async function getPropostaByIdAction({ctgom_id, id}: {id: number, ctgom_id: number}): Promise<{success: boolean; projeto: PropostaCtgom | null, message: string}> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buscar/projeto/${id}/ctgom/${ctgom_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
        return {
            success: false,
            projeto:null,
            message:"deu erro"
        }
    }
    const json = await response.json(); 
    console.log("bom :",json)
    return json
}

export async function getPropostaByIdAdminsAction(id: number): Promise<{success: boolean; proposta: PropostaCtgom | null, message: string}> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposta/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
        return {
            success: false,
            projeto:null,
            message:"deu erro"
        }
    }
    const json = await response.json(); 
    console.log("bom :",json)
    return json
}

export async function getPropostaCtgomByIdAction(id: number): Promise<{success: boolean; message:string, projeto: PropostaCtgom[]}> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projeto/ctgom/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
        return {
            success: false,
            projeto: [],
            message: "Erro ao buscar propostas"
        }
    }
    return response.json();
}