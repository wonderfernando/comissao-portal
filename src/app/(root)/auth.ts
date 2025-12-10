"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DtoCheckUser } from "./interface";
import { Usuario } from "./ctgom/interface";

export async function getCookie() {
    const cookieStore = await cookies();
    const getCoockie = cookieStore.get('auth_token');
    return getCoockie
}

export async function getAuth() {
    const cookieStore = await cookies();
    const getCoockie = cookieStore.get('auth_token');
    if (!getCoockie) {
        redirect('/auth/entrar');
    }
    const cookie = getCoockie.value as string;
    return { "Authorization": `Bearer ${cookie}` };
}

export const setCookie = async (token: string) => {
    const cookieStore = cookies();
    (await cookieStore).set('auth_token', token, { path: '/', maxAge: 60 * 60 * 24 * 7 }); // 7 days
}

export const logoutAction = async () => {
    const cookieStore = cookies();
    (await cookieStore).delete('auth_token');
    redirect('/auth/entrar');
}

export async function getCurrentUserToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const getCoockie = cookieStore.get('auth_token');
    return getCoockie ? getCoockie.value : null;
}

export async function getCurrentUser(): Promise<Usuario | null> {
    const token = await getCurrentUserToken();
    if (!token) {
        return null;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comissao-checkauth`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
        redirect('/auth/entrar');
    }
    const data = await response.json();
    return data?.user;
}

export async function getCurrentUserAllData(): Promise<{
    user: Usuario, 
    gestor_provincial: {
        id: number,
        provincia_id: number,
        ativo: number,
    },
    gestor_municipal: {
        id: number,
        municipio_id: number,
        ativo: number,
    },
    
} | null> {
    const token = await getCurrentUserToken();
    if (!token) {
        return null;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkauth`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    if (!response.ok) {
        console.log(`Erro: ${await response.text()}`)
        redirect('/auth/entrar');
    }
    const data = await response.json();
    return data;
}

export const isAuthenticated = async (): Promise<boolean> => {
    const cookieStore = await cookies();
    const getCoockie = cookieStore.get('auth_token');
    return getCoockie ? true : false;
}