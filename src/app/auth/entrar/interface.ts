import z from "zod";

export interface FormLoginValues {
    email: string;
    password: string;
}

export const loginShema = z.object({
    email: z.email("Email inválido"),
    password: z.string({error: "Palavra passe inválida"}).min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const emailResetShema = z.object({
    email: z.email("Email inválido"),
});

export type ILogin = z.infer<typeof loginShema>; 
export type IEmailReset = z.infer<typeof emailResetShema>;


 
export const UserSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string().email(),
  telefone: z.string(),
  bi: z.string().nullable(),
  data_nascimento: z.string().nullable(),
  genero: z.string().nullable(),
  status: z.string(),
  tipo: z.string(),
  natural_id: z.string().nullable(),
  criado_por: z.number(),
  created_at: z.string(), // poderia validar como datetime se quiser
  updated_at: z.string(),
  deleted_at: z.string().nullable()
});

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  user: UserSchema,
  token: z.string(),
  mensagem: z.string()
});

// Tipo inferido em TypeScript
export type LoginResponseDTO = z.infer<typeof LoginResponseSchema>;
