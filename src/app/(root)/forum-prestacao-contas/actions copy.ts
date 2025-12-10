"use server"

import { getAuth } from "../auth";
import { PropostaOneResponseDTO, PropostaResponseDTO } from "./[id]/propostas/interface";
import { DtoResponseGetAllCtgom, DtoResponseGetCtgom, DtoResponseMandatos } from "./interface";


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
        console.log(`Erro: ${await response.text()}`)
        if (response.status == 401)
            throw new Error("Esse muncipio já tem uma CTGOM associada")
        throw new Error("Erro ao salvar a Ctgom")
    }   
    return response.json();
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
      
        throw new Error("Erro ao salvar a Mandato")
    }   
    return response.json();
}


export async function getAllCtgomAction() : Promise<DtoResponseGetAllCtgom> {
   await new Promise(resolve => setTimeout(resolve, 5000));
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ctgom`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok && response.status !== 404) {
        console.log(`Erro: ${await response.text()}`)
        throw new Error("Erro ao buscar as CTGOMs")
    }
    return response.json();
}

export async function getCtgomAction(id: number) : Promise<DtoResponseGetCtgom> {
   await new Promise(resolve => setTimeout(resolve, 5000));
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ctgom/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
        throw new Error("Erro ao buscar CTGOM")
    }
    return response.json();
}


export async function getCtgomMandatosAction(id: number) : Promise<DtoResponseMandatos> {
   await new Promise(resolve => setTimeout(resolve, 5000));
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ctgom/${id}/membros`, {
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

export async function getPropostasByCtgomAction(id: number) : Promise<PropostaResponseDTO> {
   await new Promise(resolve => setTimeout(resolve, 5000));
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposta/ctgom/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok && response.status !== 404) {
        console.log(`Erro: ${await response.text()}`)
        throw new Error("Erro ao buscar propostas")
    }
    return response.json();
}

export async function getPropostaByIdAction(id: number) : Promise<PropostaOneResponseDTO> {
   await new Promise(resolve => setTimeout(resolve, 5000));
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposta/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
        throw new Error("Erro ao buscar propostas")
    }
    return response.json();
}