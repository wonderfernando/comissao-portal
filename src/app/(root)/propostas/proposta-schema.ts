import z from "zod";

export const PropostaCreateSchema = z.object({
  titulo: z.string().min(1, "titulo é obrigatório"),
  descricao: z.string().min(1, "descricao é obrigatória"),
  bairro_id: z.coerce.number().min(1, "bairro_id é obrigatório"),
  custo_estimado: z
    .string()
    .regex(/^\d+$/, "custo_estimado deve conter apenas dígitos (string)")
    .min(1),
    categoria_id: z.coerce.number().min(1, "categoria_id é obrigatório"),
  localizacao: z.string().min(1, "localizacao é obrigatória"),
  ano: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "ano deve estar no formato YYYY-MM-DD"),
   uploads: z.array(z.object({
    nome: z.string().min(1, "Título é obrigatório"),
    descricao: z.string().min(1, "Descrição é obrigatória"),
    tipo: z.string().min(1, "Descrição é obrigatória"),
  })).optional(),
});

// tipo TypeScript inferido
export type PropostaCreateDTO = z.infer<typeof PropostaCreateSchema>;
