export interface Children {
    children: React.ReactNode;
}

export interface DtoCheckUser {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  bi: string;
  data_nascimento: string; // ou Date, se quiser converter para objeto Date
  genero: "masculino" | "feminino" | string; // pode restringir se quiser
  status: "ativo" | "inativo" | string;
  tipo: "admin_municipal" | "admin_provincial" | "user" | string; // adicione outros tipos se houver
  natural_id: number;
  criado_por: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Categoria {
    id: number;
    nome: string;
    descricao: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
export interface DtoResponseCategorias  {
    success: boolean;
    dados: Categoria[];
} 