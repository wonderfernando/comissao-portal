"use server"

import { revalidatePath } from "next/cache";
import { getAuth } from "../auth";
import { PropostaOneResponseDTO, PropostaResponseDTO } from "./[id]/propostas/interface";
import { DtoResponse, DtoResponseGetAllCtgom, DtoResponseGetCtgom, DtoResponseMandatos, Forum, ForumResponse } from "./interface";


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

export async function saveForumAction(data: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forun`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.log(`Erro: ${await response.text()} ${response.status}`)
        if (response.status == 403)
            return { success: false, message: "Você não tem permissão para criar um fórum" }
        return { success: false, message: "Erro ao salvar o fórum" }
    }
    console.log(await response.text())
    revalidatePath('/forum-prestacao-contas');
    revalidatePath('/forum-recolha-contribuicao');

    return { success: true, message: "Fórum salvo com sucesso!" };
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

export async function saveFormContribuicao(data: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forun_contibuicoes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)

       return { success: false, message: "Erro ao salvar a contribuição" };
    }
    revalidatePath('/forum-recolha-contribuicao');
    return { success: true, message: "Contribuição salva com sucesso!" };
}
export async function saveFormPrestacaoContas(data: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forun_prestacao_contas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)

       return { success: false, message: "Erro ao salvar a contribuição" };
    }
    revalidatePath('/forum-recolha-contribuicao');
    return { success: true, message: "Contribuição salva com sucesso!" };
}
export async function deleteForum(id: number) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forun_contibuicoes/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });

    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
       return { success: false, message: "Erro ao remover o forum de recolha de contribuição" };
    }
    revalidatePath('/forum-contribuicao');
    return { success: true, message: "Forum de recolha de contribuição removido com sucesso!" };
}

export async function getAllForumPrestacaoAction(): Promise<{ success: boolean; dados: Forum[] }> {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forun/prestacao_conta`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok && response.status !== 404) {
        console.log(`Erro: ${await response.text()}`)
        return { success: false, dados: [] };
    }
    const data = await response.json();
    return data;
}



export async function getCtgomAction(id: number): Promise<DtoResponseGetCtgom> {
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


export async function getForumById(id: number): Promise<{ success: boolean; dados: Forum | null}> {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forun/all/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
    });
    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
        return { success: false, dados: null };
    }
    return response.json();
}


export async function getCtgomMandatosAction(id: number): Promise<DtoResponseMandatos> {
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

export async function getPropostasByCtgomAction(id: number): Promise<PropostaResponseDTO> {
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

export async function getPropostaByIdAction(id: number): Promise<PropostaOneResponseDTO> {
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