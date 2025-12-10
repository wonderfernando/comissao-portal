import z from "zod";

export const anoSchema = z.object({
    ano: z.string().regex(/^\d{4}$/, { message: "Informe um ano válido de 4 dígitos." }),
});

export type AnoAtividade = z.infer<typeof anoSchema>;

export interface Ano{
    id: string;
    ano: string;
    ativo: number
}