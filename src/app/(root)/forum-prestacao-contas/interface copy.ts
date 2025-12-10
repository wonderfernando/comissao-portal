 
import {  z } from "zod"

export const ctgomSchema = z.object({
  localizacao: z.string().min(1, "Localização é obrigatória"),
  municipio_id: z.coerce.number("Selecione um município valido").min(1, "Município é obrigatório"),
    ano: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
 })

export const mandatoSchema = z.object({
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
  data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido (YYYY-MM-DD)"),
  ctgom_id: z.number().min(1, "CTGOM é obrigatório"),
  membros: z.array(z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    funcao: z.string().min(1, "Função é obrigatória"),
    contacto: z.string().min(1, "Contacto é obrigatório"),
    email: z.email("Email é obrigatório"),
  })),
  uploads: z.array(z.object({
    nome: z.string().min(1, "Título é obrigatório"),
    tipo: z.string().min(1, "Descrição é obrigatória"),
  })).optional(),
 })
 export type MandatoFormValues = z.infer<typeof mandatoSchema>
export type CtgomFormValues = z.infer<typeof ctgomSchema>

export interface Municipio {
  id: number;
  provincia_id: number;
  nome: string;
  deleted_at: string | null;
}
 

export interface Provincia {
  id: number;
  nome: string;
  criado_por: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  municipios: Municipio[]; // tipagem do array de municípios
}

export interface Membro {
  id: number;
  nome: string;
  funcao: string;
  contacto: string;
  email: string;
  imagem: string;
}

export interface Mandato_ {
  id: number;
  data_inicio: string;
  data_fim: string | null;
  ctgom_id: number;
  membros: Membro[];
}



export interface DtoResponseGetAllCtgom {
  success: boolean;
  dados: Ctgom[];
  mensagem: string;
}

export interface DtoResponseGetCtgom {
  success: boolean;
  dados: Ctgom;
  mensagem: string;
}

export interface Ctgom {
  id: number;
  nome: string;
  codigo: string;
  localizacao: string;
  ano: string; // "YYYY-MM-DD"
  municipio_id: number;
  criado_por: Usuario;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  deleted_at: string | null;
  municipio: Municipio;
  documento: Documento[];
  membros: Membro[];
 
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  bi: string;
  data_nascimento: string; // "YYYY-MM-DD"
  genero: string;
  status: string;
  tipo: string;
  natural_id: number | null;
  criado_por: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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

export interface Documento {
  // estrutura ainda não definida no JSON
}
export interface UserMembro {
  id: number
  nome: string
  email: string
  telefone: string
  bi: string | null
  data_nascimento: string | null
  genero: string | null
  status: string
  tipo: string
  natural_id: number | null
  criado_por: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Membro {
   id: number
  ctgom_id: number
  user_id: number
  mandato_id: number
  funcao: string
  ativo: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  user_membro: UserMembro
}


export interface DtoResponseMandatos {
  success: boolean
  dados: Mandato[]
  mensagem: string
}

export interface Mandato {
  id: number
  ctgom_id: number
  data_inicio: string
  data_fim: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  membros: Membro[]
  documento: Anexo[]
  anexos: Anexo[]
}
export interface Anexo {
 	id: number,
	ctgom_id: number,
	tipo: string,
	nome: string,
  created_at: string,
	mandato_id: number,
	url_ficheiro: string
}


export interface UploadResponseDTO {
  success: boolean;
  upload: {
    success: boolean;
    tipo: "imagem" | "video" | "documento"; // pode restringir os tipos
    nome: string;
    mensagem: string;
  };
}