import { z } from "zod"

export const relatorioSchema = z.object({
  forun_id: z.string().min(1, "Selecione um fórum"),
  proposta_id: z.string().min(1, "Selecione um projeto"),
  prioridade: z.enum(["baixa", "media", "alta"]),
  resumo: z.string().min(10, "Resumo deve ter ao menos 10 caracteres"),
  feedback: z.string().min(1, "Feedback deve ter ao menos 10 caracteres"),
   uploads: z
    .array(
      z.object({
        tipo: z.enum(["pdf", "imagem"]),
        nome: z.string().min(1),
      })
    )
    .optional(),
})
