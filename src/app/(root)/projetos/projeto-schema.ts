import { z } from "zod"

export const ProjetoCreateSchema = z.object({
    titulo: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
    descricao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
    custo_estimado: z.string().min(1, "O custo estimado é obrigatório"),
    localizacao: z.string().min(3, "A localização é obrigatória"),
    categoria_id: z.coerce.number().min(1, "Selecione uma categoria"),
    ano: z.string().min(1, "O ano é obrigatório"),
    bairro_id: z.number().optional(),
    uploads: z.array(z.object({
        nome: z.string(),
        tipo: z.string()
    })).optional()
})

export type ProjetoCreateDTO = z.infer<typeof ProjetoCreateSchema>
