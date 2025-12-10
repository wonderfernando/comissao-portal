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
import { getForumById, saveForumAction } from "../actions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Forum } from "../interface"

const eventoSchema = z.object({
  tipo: z.string(),
  titulo: z.string().min(3, "Informe um título"),
  descricao: z.string().optional().nullable(),
  data_inicio: z.string().min(1, "Informe a data de início"),
  data_fim: z.string().min(1, "Informe a data de fim"),
  local: z.string().min(1, "Informe o local"),
  participantes: z
    .array(
      z.object({
        nome: z.string().min(1, "Informe o nome"),
        papel: z.string().min(1, "Informe o papel"),
      })
    )
    .optional(),
})

type EventoFormData = z.infer<typeof eventoSchema>

export function EditForumDialog({ forum, open, setOpen }: {
  setOpen: (value: boolean) => void,
  forum: Forum,
  open: boolean
}) {
      console.log("Forum in edit:", forum);

  const form = useForm<EventoFormData>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      tipo: "recolha_contribuicoes",
      titulo: forum.titulo,
      descricao: forum.descricao,
      data_inicio: forum.data_inicio,
      data_fim: forum.data_fim,
      local:  forum.local || "",
      participantes: forum.participantes,
    },
  })

  

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participantes",
  })


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
      toast.success(data?.message || "Forum de contribuição adicionado!")
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger />

      <DialogContent className="sm:max-w-2xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Registar  Forum de Contribuições</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-100px)] md:h-[calc(100vh-150px)]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data) => {
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
                                      <SelectItem value="Moderador">Moderador</SelectItem>
                                      <SelectItem value="Participante">Participante</SelectItem>
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
                      onClick={() => append({ nome: "", papel: "" })}
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
