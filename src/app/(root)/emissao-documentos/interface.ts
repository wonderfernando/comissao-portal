export type DocumentType =
    | 'declaracao-morador'
    | 'declaracao-morador-menor'
    | 'ocorrencia-obito'
    | 'declaracao-ocorrencia';

export interface DeclaracaoMoradorData {
    nome_completo: string;
    numero_bi: string;
    nacionalidade: string;
    data_emissao: string;
    tipo_documento: string;
    data_nascimento: string;
    nome_pai: string;
    nome_mae: string;
    tipo_documento_id: number;
    estado_civil: string;
    ambito_territorial: string;
}

export interface DeclaracaoMoradorMenorData {
    nome_menor: string;
    data_nascimento_menor: string;
    nome_responsavel: string;
    bi_responsavel: string;
    parentesco: string;
    endereco: string;
    bairro: string;
    municipio: string;
    motivo: string;
}

export interface OcorrenciaObitoData {
    nome_falecido: string;
    bi_falecido: string;
    data_nascimento: string;
    data_obito: string;
    hora_obito: string;
    local_obito: string;
    causa_morte: string;
    nome_declarante: string;
    bi_declarante: string;
    parentesco_declarante: string;
    telefone_declarante: string;
}

export interface DeclaracaoOcorrenciaData {
    tipo_ocorrencia: string;
    data_ocorrencia: string;
    hora_ocorrencia: string;
    local_ocorrencia: string;
    descricao_ocorrencia: string;
    nome_declarante: string;
    bi_declarante: string;
    telefone_declarante: string;
    endereco_declarante: string;
}

export type DocumentData =
    | DeclaracaoMoradorData
    | DeclaracaoMoradorMenorData
    | OcorrenciaObitoData
    | DeclaracaoOcorrenciaData;

export interface DocumentRecord {
    id: number;
    tipo: DocumentType;
    nome_solicitante: string;
    bi_solicitante: string;
    data_emissao: string;
    status?: string;
    originalData?: any;
}

export interface DocumentsListResponse {
    success: boolean;
    documents: DocumentRecord[];
}





export interface DadosDTO {
    cidadao: Cidadao | null;
    comissao: Comissao;
    count: number;
    user: User;
    hash_qr: string | null;
    admin: User;
    tipo_documento: TipoDocumento;
    emitir_documento?: EmitirDocumento[];
    id?: number;
    nome?: string;
    descricao?: string | null;
    nome_arquivo?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}


export interface Cidadao {
    nome_completo: string;
    numero_bi: string;
    nacionalidade: string;
    data_emissao: string; // ISO Date
    tipo_documento: string;
    data_nascimento: string; // ISO Date
    nome_pai: string;
    nome_mae: string;
    tipo_documento_id: number;
    estado_civil: string;
    ambito_territorial: string;
    bairro_id: number;
}


export interface Comissao {
    id: number;
    codigo: string;
    email: string;
    nome: string;
    localizacao: string;
    delimitacao_geografica: string;
    contacto: string;
    status: "ativo" | "inativo";
    bairro_id: number;
    comissao_estado_id: number;
    ambito_territorial: string;
    criado_por: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    bairro: Bairro;
}

export interface Bairro {
    id: number;
    nome: string;
    comuna_id: number;
    criado_por: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    comuna: Comuna;
}

export interface Comuna {
    id: number;
    nome: string;
    municipio_id: number;
    criado_por: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    municipio: Municipio;
}

export interface Municipio {
    id: number;
    nome: string;
    provincia_id: number;
    criado_por: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    provincia: Provincia;
}

export interface Provincia {
    id: number;
    nome: string;
    criado_por: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}


export interface User {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    bi: string | null;
    data_nascimento: string | null;
    genero: string | null;
    status: "ativo" | "inativo";
    tipo: string;
    natural_id: number | null;
    criado_por: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface TipoDocumento {
    id: number;
    nome: string;
    descricao: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    nome_arquivo: string;
}

export interface EmitirDocumentoDados {
    nome_mae: string;
    nome_pai: string;
    bairro_id: number;
    numero_bi: string;
    data_emissao: string;
    estado_civil: string;
    nacionalidade: string;
    nome_completo: string;
    tipo_documento: string;
    data_nascimento: string;
    tipo_documento_id: number;
    ambito_territorial: string;
    nome_menor?: string;
    bi_responsavel?: string;
    nome_responsavel?: string;
    data_obito?: string;
    nome_declarante?: string;
    bi_declarante?: string;
    descricao_ocorrencia?: string;
    tipo_declaracao?: string;
}

export interface EmitirDocumento {
    id: number;
    tipo_documeto_id: number; // Note: user JSON has typo "tipo_documeto_id"
    comissao_id: number;
    bairro_id: number;
    hash_qr: string;
    dados: EmitirDocumentoDados;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    // Optional relations if needed
    comissao?: Comissao;
    bairro?: Bairro;
}
