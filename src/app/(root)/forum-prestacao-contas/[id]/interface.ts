export interface EventoResponse {
  success: boolean;
  dados: Evento;
}

export interface Evento {
  id: number;
  tipo: string;
  titulo: string;
  descricao: string | null;
  data_inicio: string;
  data_fim: string;
  local: string | null;
  municipio_id: number;
  criado_por: Usuario;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  municipio: Municipio;
  participantes: Participante[];
  forun_contribuicao: any[]; // ajustar se tiver modelo
  forun_prestacao_contas: any[]; // ajustar se tiver modelo
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  bi: string;
  data_nascimento: string;
  genero: string;
  status: string;
  tipo: string;
  natural_id: number;
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

export interface Participante {
  // definir campos se necessário
}
