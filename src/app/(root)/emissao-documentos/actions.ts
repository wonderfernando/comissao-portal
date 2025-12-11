"use server"

import { revalidatePath } from "next/cache";
import { getAuth } from "../auth";
import { DadosDTO, DocumentData, DocumentType, DocumentsListResponse, EmitirDocumento, DocumentRecord } from "./interface";

export async function saveDocumentAction(
    data: any
): Promise<{
    success: boolean,
    dados: DadosDTO | null,
    mensagem?: string,
}> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pessoa`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(await getAuth()),
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const ret = await response.json();
            console.log(ret);
            return ret
        }
        // const result = await response.json();
        revalidatePath('/emissao-documentos');
        return await response.json()
    } catch (error) {
        console.error("Error in saveDocumentAction:", error);
        return {
            success: false,
            dados: null,
            mensagem: "Erro ao processar requisição. Verifique sua conexão.",
        };
    }
}

export async function printDocumentAction(
    type: DocumentType,
    documentId: number
): Promise<{
    success: boolean;
    message: string;
    pdfUrl?: string;
}> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/documento/${type}/${documentId}/print`,
            {
                method: "GET",
                headers: {
                    ...(await getAuth()),
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error printing document:", errorText);
            return {
                success: false,
                message: "Erro ao gerar PDF. Por favor, tente novamente.",
            };
        }

        // Get the PDF blob
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        return {
            success: true,
            message: "PDF gerado com sucesso!",
            pdfUrl: url,
        };
    } catch (error) {
        console.error("Error in printDocumentAction:", error);
        return {
            success: false,
            message: "Erro ao processar requisição de impressão.",
        };
    }
}

export async function getAllDocumentsAction(): Promise<DocumentsListResponse> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pessoa/buscar_documento/tipo`,
            {
                method: "GET",
                headers: {
                    ...(await getAuth()),
                },
            }
        );

        if (!response.ok && response.status !== 404) {
            console.error("Error fetching documents");
            return {
                success: false,
                documents: [],
            };
        }

        const result = await response.json();

        const allDocuments: DocumentRecord[] = [];

        // The API returns an array of categories (types), each containing 'emitir_documento'
        const categories = Array.isArray(result.dados) ? result.dados : [];

        for (const category of categories) {
            const docs = Array.isArray(category.emitir_documento) ? category.emitir_documento : [];

            for (const doc of docs) {
                let tipo: DocumentType = 'declaracao-morador';
                let nome = "Desconhecido";
                let bi = "N/A";

                // Determine type and map fields based on category or internal logic
                // We can check category.id or infer from content
                // Category IDs from user JSON: 2 -> Declaracao Morador, 3 -> Menor, 4 -> Obito, 5 -> Ocorrencia

                // We can also potentially map based on doc.tipo_documeto_id if available and reliable
                const typeId = doc.tipo_documeto_id || category.id;

                if (typeId === 2) {
                    tipo = 'declaracao-morador';
                    nome = doc.dados?.nome_completo || doc.dados?.nome || nome;
                    bi = doc.dados?.numero_bi || bi;
                } else if (typeId === 3) {
                    tipo = 'declaracao-morador-menor';
                    nome = doc.dados?.nome_completo || doc.dados?.nome_menor || nome;
                    bi = doc.dados?.numero_bi || doc.dados?.bi_responsavel || bi;
                } else if (typeId === 4) {
                    tipo = 'ocorrencia-obito';
                    nome = doc.dados?.nome_falecido || doc.dados?.nome_completo || nome;
                    bi = doc.dados?.numero_bi || bi; // BI of deceased usually
                } else if (typeId === 5) {
                    tipo = 'declaracao-ocorrencia';
                    nome = doc.dados?.nome_declarante || doc.dados?.nome_completo || nome;
                    bi = doc.dados?.numero_bi || doc.dados?.bi_declarante || bi;
                }

                allDocuments.push({
                    id: doc.id,
                    tipo: tipo,
                    nome_solicitante: nome,
                    bi_solicitante: bi,
                    data_emissao: doc.created_at || doc.dados?.data_emissao,
                    hora_emissao: doc.created_at?.split("T")[1]?.split(".")[0] || doc.dados?.hora_emissao.split("T")[1]?.split(".")[0],
                    status: 'emitido',
                    originalData: doc
                });
            }
        }

        return {
            success: true,
            documents: allDocuments,
        };
    } catch (error) {
        console.error("Error in getAllDocumentsAction:", error);
        return {
            success: false,
            documents: [],
        };
    }
}

export async function getDeclaracoesMoradorAction(): Promise<DocumentsListResponse> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pessoa/buscar_documento/tipo/2`,
            {
                method: "GET",
                headers: {
                    ...(await getAuth()),
                },
            }
        );

        if (!response.ok) {
            console.error("Error fetching declaracoes morador");
            return {
                success: false,
                documents: [],
            };
        }

        const result = await response.json();
        console.log("diretamente ",result)
        // Access dados.emitir_documento from the response
        const rawDocs: EmitirDocumento[] = result.dados?.[0]?.emitir_documento || [];

        const documents: DocumentRecord[] = rawDocs.map((doc) => ({
            id: doc.id,
            tipo: 'declaracao-morador',
            nome_solicitante: doc.dados.nome_completo,
            bi_solicitante: doc.dados.numero_bi,
            data_emissao: doc.created_at,
            hora_emissao: doc.created_at.split("T")[1].split(".")[0],
            status: 'emitido',
            originalData: doc
        }));

        return {
            success: true,
            documents: documents,
        };
    } catch (error) {
        console.error("Error in getDeclaracoesMoradorAction:", error);
        return {
            success: false,
            documents: [],
        };
    }
}

export async function getDeclaracoesMoradorMenorAction(): Promise<DocumentsListResponse> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pessoa/buscar_documento/tipo/3`,
            {
                method: "GET",
                headers: {
                    ...(await getAuth()),
                },
            }
        );

        if (!response.ok) {
            console.error("Error fetching declaracoes morador");
            return {
                success: false,
                documents: [],
            };
        }

        const result = await response.json();
        // Access dados.emitir_documento from the response
        const rawDocs: EmitirDocumento[] = result.dados?.[0]?.emitir_documento || [];

        const documents: DocumentRecord[] = rawDocs.map((doc) => ({
            id: doc.id,
            tipo: 'declaracao-morador-menor',
            nome_solicitante: doc.dados.nome_completo,
            bi_solicitante: doc.dados.numero_bi,
            hora_emissao: doc.created_at.split("T")[1].split(".")[0],
            data_emissao: doc.created_at,
            status: 'emitido',
            originalData: doc
        }));

        return {
            success: true,
            documents: documents,
        };
    } catch (error) {
        console.error("Error in getDeclaracoesMoradorMenorAction:", error);
        return {
            success: false,
            documents: [],
        };
    }
}

export async function getOcorrenciasObitoAction(): Promise<DocumentsListResponse> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pessoa/buscar_documento/tipo/4`,
            {
                method: "GET",
                headers: {
                    ...(await getAuth()),
                },
            }
        );

        if (!response.ok) {
            console.error("Error fetching ocorrencias obito");
            return {
                success: false,
                documents: [],
            };
        }

        const result = await response.json();
        const rawDocs: EmitirDocumento[] = result.dados?.[0]?.emitir_documento || [];

        const documents: DocumentRecord[] = rawDocs.map((doc) => ({
            id: doc.id,
            tipo: 'ocorrencia-obito',
            nome_solicitante: doc.dados.nome_completo || "Desconhecido",
            bi_solicitante: doc.dados.numero_bi || "N/A",
            data_emissao: doc.created_at,
            hora_emissao: doc.created_at.split("T")[1].split(".")[0],
            status: 'emitido',
            originalData: doc
        }));

        return {
            success: true,
            documents: documents,
        };
    } catch (error) {
        console.error("Error in getOcorrenciasObitoAction:", error);
        return {
            success: false,
            documents: [],
        };
    }
}

export async function getDeclaracaoOcorrenciaAction(): Promise<DocumentsListResponse> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pessoa/buscar_documento/tipo/5`,
            {
                method: "GET",
                headers: {
                    ...(await getAuth()),
                },
            }
        );

        if (!response.ok) {
            console.error("Error fetching declaracoes ocorrencia");
            return {
                success: false,
                documents: [],
            };
        }

        const result = await response.json();
        const rawDocs: EmitirDocumento[] = result.dados?.[0]?.emitir_documento || [];

        const documents: DocumentRecord[] = rawDocs.map((doc) => ({
            id: doc.id,
            tipo: 'declaracao-ocorrencia',
            nome_solicitante: doc.dados.nome_completo || doc.dados.nome_declarante || "Desconhecido",
            bi_solicitante: doc.dados.numero_bi || doc.dados.bi_declarante || "N/A",
            data_emissao: doc.created_at,
            hora_emissao: doc.created_at.split("T")[1].split(".")[0],
            status: 'emitido',
            originalData: doc
        }));

        return {
            success: true,
            documents: documents,
        };
    } catch (error) {
        console.error("Error in getDeclaracaoOcorrenciaAction:", error);
        return {
            success: false,
            documents: [],
        };
    }
}
