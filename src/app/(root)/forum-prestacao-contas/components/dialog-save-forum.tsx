"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Input } from "@/components/ui/input"

import { saveForumAction } from "../actions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { en } from "zod/v4/locales"
import { getAnoAtividadeAction } from "../../ano-atividade/actions"

const eventoSchema = z.object({
  tipo: z.string(),
  titulo: z.string().min(3, "Informe um título"),
  descricao: z.string().optional().nullable(),
  data_inicio: z.string().min(1, "Informe a data de início"),
  data_fim: z.string().min(1, "Informe a data de fim"),
  local: z.string().min(1, "Informe o local"),
  ano_forum_id: z.coerce.number().min(1, "Selecione o ano de actividade"),

  participantes: z
    .array(
      z.object({
        nome: z.string().min(1, "Informe o nome"),
        papel: z.string().min(1, "Informe o papel"),
        entidade: z.string().min(1, "Informe a entidade"),
      })
    )
    .optional(),
})

type EventoFormData = z.infer<typeof eventoSchema>

export function SaveForumDialog({ children }: { children: React.ReactNode }) {
  const form = useForm({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      tipo: "prestacao_contas",
      titulo: "",
      descricao: "",
      ano_forum_id: 0,
      data_inicio: "",
      data_fim: "",
      local: "",
      participantes: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participantes",
  })

  const [open, setOpen] = useState(false)
  const router = useRouter()

  const { mutateAsync: saveEvento, isPending: isLoading } = useMutation({
    mutationFn: saveForumAction,
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error("Erro ao salvar o forum", {
          description: data?.message || "Ocorreu um erro inesperado.",
        })
        return
      }
      toast.success(data?.message || "Forum de prestação de contas adicionado!")
      form.reset()
      setOpen(false)
      router.refresh()
    },
    onError: (error: any) => {
      toast.error("Erro ao salvar o forum", {
        description: error?.message || "Ocorreu um erro inesperado.",
      })
    },
  })
  const { data: anosActividades, isFetching } = useQuery({
    queryFn: getAnoAtividadeAction,
    queryKey: ["ano-atividade-list-forum"],
  })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-2xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Registar Fórum de Prestação de Contas</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-100px)] md:h-[calc(100vh-150px)]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data) => {
                console.log(data)
                await saveEvento(data)
              })}
              className="space-y-4 flex flex-col flex-1 overflow-y-auto px-4"
            >
              {/* Campos principais */}
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descrição" rows={3} {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`ano_forum_id`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Ano de actividade</FormLabel>
                      <FormControl>
                        <Select  {...field} value={field.value?.toString() || "0"} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o ano de actividade" />
                          </SelectTrigger>
                          <SelectContent>
                            {
                              anosActividades?.dados.map((ano) => (
                                <SelectItem key={ano.id} value={ano.id.toString()}>{ano.ano}</SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3 ">
                  <FormField
                    control={form.control}
                    name="data_inicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="data_fim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Fim</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="local"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local</FormLabel>
                      <FormControl>
                        <Input placeholder="Local do evento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Lista de participantes */}
              <Card>
                <CardContent>
                  <ScrollArea className="h-40 mt-4">
                    <h3 className="text-sm font-medium mb-2">Participantes</h3>
                    <div className="space-y-3">
                      {fields.map((fieldItem, index) => (
                        <div key={fieldItem.id} className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`participantes.${index}.nome`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input placeholder="Nome" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`participantes.${index}.papel`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Select  {...field} value={field.value || ""} onValueChange={field.onChange}>
                                    <SelectTrigger value="Selecione o papel" className="w-full">
                                      <SelectValue placeholder="Selecione o papel" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="organizacao">Moderador</SelectItem>
                                      <SelectItem value="cidadao">Participante</SelectItem>

                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="mt-3 flex items-center gap-2"
                      onClick={() => append({ nome: "", papel: "", entidade: "_" })}
                    >
                      <Plus className="w-4 h-4" /> Adicionar participante
                    </Button>
                  </ScrollArea>
                </CardContent>
              </Card>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                  Salvar {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
