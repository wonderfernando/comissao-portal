"use server"

export interface DocumentoVerificado {
    nome_completo: string;
    numero_bi: string;
    data_emissao: string;
    local_emissao: string;
    data_nascimento: string;
    nome_pai: string;
    nome_mae: string;
    criado_por: string;
    estado_civil: string;
    nacionalidade: string;
    ambito_territorial: string;
    tipo_documento: string;
    [key: string]: any;
}

export interface VerificarDocumentoResponse {
    success: boolean;
    dados?: DocumentoVerificado;
    mensagem?: string;
}

export async function verificarDocumentoAction(hash: string): Promise<VerificarDocumentoResponse> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/verificar-documento/${hash}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return errorData
        }

        const result = await response.json();

        return result
    } catch (error) {
        console.error("Error in verificarDocumentoAction:", error);
        return {
            success: false,
            mensagem: "Erro ao verificar documento. Verifique sua conexão.",
        };
    }
}
