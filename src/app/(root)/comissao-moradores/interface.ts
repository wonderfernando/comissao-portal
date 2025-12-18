import { z } from "zod"


const uploadDocumentSchema = z.object({
  nome: z.string().min(1, "Nome do documento é obrigatório"),
  tipo: z.string().min(1, "Tipo do documento é obrigatório"),
  descricao: z.string().min(1, "Descrição do documento é obrigatória"),

})

export const comissaoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  localizacao: z.string().min(1, "Localização é obrigatória"),
  delimitacao_geografica: z.string().min(1, "Delimitação é obrigatória"),
  contacto: z.string().min(1, "Contactos são obrigatórios"),
  bairro_id: z.coerce.number("Selecione um bairro").positive("Selecione um bairro"),
  email: z.email("Informe um email válido"),
  uploads: z.array(uploadDocumentSchema).optional(),
  ambito_territorial: z.string().min(1, "Âmbito territorial é obrigatório"),

})

export type ComissaoFormValues = z.infer<typeof comissaoSchema>

export const membroSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  funcao: z.string().min(1, "Função é obrigatória"),
  contacto: z.string().min(1, "Contacto é obrigatório"),
  email: z.email("Informe um email válido"),
})
export type MembroForm = z.infer<typeof membroSchema>

export const mandatoSchema = z.object({
  data_inicio: z.string().min(1, "Data de início é obrigatória"),
  data_fim: z.string().min(1, "Data de fim é obrigatória"),
  comissao_id: z.coerce.number().positive("Selecione uma comissão válida"),
  membros: z.array(membroSchema).min(1, "Pelo menos um membro é obrigatório"),
})
export type MandatoForm = z.infer<typeof mandatoSchema>

export interface Bairro {
  id: number;
  nome: string;
  comuna_id: number;
  criado_por: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}



export interface Municipio {
  id: number;
  provincia_id: number;
  nome: string;
  deleted_at: string | null;
  comuna: Comuna[]; // tipagem do array de municípios
}
export interface Comuna {
  id: number;
  municipio_id: number;
  nome: string;
  deleted_at: string | null;
  bairro: Bairro[]; // tipagem do array de municípios
}


export interface Provincia {
  id: number;
  nome: string;
  criado_por: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  municipio: Municipio[]; // tipagem do array de municípios
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  bi: string | null;
  data_nascimento: string | null; // ISO Date string
  genero: string | null;
  status: string;
  tipo: string;
  natural_id: number | null;
  criado_por: Usuario | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Bairro {
  id: number;
  nome: string;
  comuna: {
    nome: string;
    municipio: {
      nome: string;
      provincia: Provincia;
    };
  };
  comuna_id: number;
  criado_por: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
export type DocumentoTipo = "imagem" | "pdf" | "video" | "outro";

export interface Documento {
  id: number;
  comissao_id: number;
  tipo: DocumentoTipo;
  nome: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  url_ficheiro: string;
}

export interface Membro {
  // Preenche depois quando souber a estrutura
}

export interface Mandato {

  id: number;
  comissao_id: number;
  data_inicio: string; // "YYYY-MM-DD"
  data_fim: string;    // "YYYY-MM-DD"
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  membro: MembroComissao[];

}
export interface MembroComissao {
  id: number;
  comissao_id: number;
  user_id: number;
  mandato_comissao_id: number;
  funcao: string; // "presidente", "secretário", etc.
  ativo: number; // 1 = ativo, 0 = inativo
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_membro: UserMembro;
}
export interface UserMembro {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  bi: string | null;
  data_nascimento: string | null;
  genero: string | null;
  status: string; // "ativo" | "inativo"
  tipo: string;   // "comissao" ou outro tipo
  natural_id: number | null;
  criado_por: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
export interface Comissao {
  id: number;
  codigo: string;
  email: string;
  nome: string;
  localizacao: string | null;
  delimitacao_geografica: string | null;
  contacto: string;
  status: string;
  bairro_id: number;
  comissao_estado_id: number;
  ambito_territorial: string;
  criado_por: Usuario | null;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  bairro: Bairro | null;
  documento: Documento[];
  membros: Membro[];
  mandato: Mandato[];
}
