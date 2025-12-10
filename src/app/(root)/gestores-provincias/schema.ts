import { z } from "zod"

export const adminSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.email("Email inválido"),
  telefone: z.string().min(9, "Telefone inválido"),
  bi: z.string().min(10, "Número de BI inválido"),
  data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data de nascimento inválida"),
  genero: z.enum(["masculino", "feminino"], "Gênero inválido"), 
  natural_id: z.coerce.number("Naturalidade inválida"),
  provincia_id: z.coerce.number("Província de gestão inválida"),
})

/* 
      "nome": "Lopes Cristovao",
    "provincia_id": 11,
    "email": "fatima.jose1@gmail.com",
    "telefone": "+244923456781",
    "bi": "007654321LA00202",
    "data_nascimento": "1992-08-15",
    "genero": "feminino",
    "natural_id": 1
*/

export type AdminFormValues = z.infer<typeof adminSchema>