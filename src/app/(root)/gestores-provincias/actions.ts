"use server"

import { revalidatePath } from "next/cache";
import { getAuth } from "../auth";
import { Provincia } from "../comissao-moradores/interface";
import { UploadResponseDTO } from "../ctgom/interface";
import { User } from "./interface";

export async function getAllProvincias(): Promise<Provincia[]> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/provincia`);
    if (!response.ok && response.status != 404) {
        throw new Error("Erro ao buscar as provincias")
    }
    const data = await response.json();
    return data?.dados
}


export async function uploadFilesAction(formData: FormData): Promise<UploadResponseDTO> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads`,
        {
            method: "POST",
            body: formData,
            headers: {
                ...(await getAuth())
            },
        })
    if (!response.ok) {

        console.log(await (response.text()))
        throw new Error("Erro ao fazer upload dos arquivos")
    }
    const data = await response.json();
    return data
}

export async function getAllAdminProvinciaUsers(): Promise<{
    success: boolean;
    message: string;
    dados: User[];
}> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buscar/gestor/provincial/funcao/user/`, {
        method: "GET",
        headers: {
            ...(await getAuth())
        }
    })
    if (!response.ok && response.status != 404) {
        return { success: false, message: "Erro ao buscar os administradores provinciais", dados: [] };
    }
    const data = await response.json();
    return data
}


export async function saveAdminActionProvincial(data: any) : Promise<{success: boolean, message: string}> {
    console.log("DATA ADMIN: ", data)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/provincial`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            ...(await getAuth())
        },
        body: JSON.stringify(data)
    })
    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
        return {success: false, message: "Erro ao salvar o administrador"};
    }
    console.log(`sucesso: ${await response.text()}`)
    revalidatePath('/gestores-provincias');
    return {success: true, message: "Administrador salvo com sucesso"} ;
}