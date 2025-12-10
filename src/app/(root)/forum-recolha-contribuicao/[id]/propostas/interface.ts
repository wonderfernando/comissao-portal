export interface PropostaResponseDTO {
  success: boolean;
  dados: Proposta[];
}

export interface PropostaOneResponseDTO {
  success: boolean;
  dados: Proposta;
}

export interface Proposta {
  id: number;
  titulo: string;
  descricao: string | null;
  custo_estimado: string;
  localizacao: string | null;
  proposta_estado_id: number;
  ctgom_id: number;
  ano: string;
  user_id: number;
  municipio_id: number;
  categoria_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  ctgom: CTGOM;
  user: User;
  municipio: Municipio;
  estado: Estado;
  categoria?: Categoria;
  anexos: any[]; // Se tiver um formato fixo, dá pra tipar melhor
}

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CTGOM {
  id: number;
  nome: string;
  codigo: string;
  localizacao: string;
  ano: string;
  municipio_id: number;
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
  status: string;
  tipo: string;
  natural_id: string | null;
  criado_por: number;
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
}

export interface Estado {
  id: number;
  nome: string;
  criado_por: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
