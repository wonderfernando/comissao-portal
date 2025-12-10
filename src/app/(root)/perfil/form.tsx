// app/user/[id]/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, Phone, Calendar, MapPin, Users } from 'lucide-react'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Usuario } from '../ctgom/interface'

const formSchema = z.object({
  nome: z.string().min(2),
  telefone: z.string().min(9),
  data_nascimento: z.string(),
  genero: z.enum(['masculino', 'feminino', 'outro']),
  naturalidade: z.string(),
})

type FormValues = z.infer<typeof formSchema>

export default function UserFormPage({ user }: { user: Usuario | null }) {
  console.log(user)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: user?.nome || '',
      telefone: user?.telefone || '',
      data_nascimento: new Date(user?.data_nascimento || "").toLocaleString("pt-PR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) || '',
      genero: 'masculino',
      naturalidade: user?.natural_id ? String(user?.natural_id) : '',
    },
  })

  const onSubmit = (data: FormValues) => {
    console.log('Dados atualizados:', data)
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8 ">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground">Visualize suas informações pessoais</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Avatar Section */}
        <Card className="h-fit ">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Avatar Circle */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center border-2 border-primary/20 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                  <User className="w-16 h-16 text-primary" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* User Info */}
              <div className="space-y-1 w-full">
                <h3 className="font-semibold text-lg truncate">{user?.nome || 'Usuário'}</h3>
                <p className="text-sm text-muted-foreground">{user?.tipo}</p>
              </div>

              {/* Stats */}
              <div className="w-full pt-4 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400 animate-pulse" />
                    Ativo
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Info Section */}
        <Card className="">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Seus dados cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Grid Layout for Fields */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Nome Completo
                        </FormLabel>
                        <FormControl>
                          <Input
                            readOnly
                            placeholder="Nome completo"
                            className="bg-muted/30 transition-all duration-200 hover:bg-muted/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          Telefone
                        </FormLabel>
                        <FormControl>
                          <Input
                            readOnly
                            placeholder="Número de telefone"
                            className="bg-muted/30 transition-all duration-200 hover:bg-muted/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="data_nascimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          Data de Nascimento
                        </FormLabel>
                        <FormControl>
                          <Input
                            readOnly
                            type="date"
                            className="bg-muted/30 transition-all duration-200 hover:bg-muted/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="naturalidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          Naturalidade
                        </FormLabel>
                        <FormControl>
                          <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="bg-muted/30 transition-all duration-200 hover:bg-muted/50">
                              <SelectValue placeholder="Selecione a naturalidade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Luanda</SelectItem>
                              <SelectItem value="2">Benguela</SelectItem>
                              <SelectItem value="3">Huambo</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="genero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          Gênero
                        </FormLabel>
                        <FormControl>
                          <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="bg-muted/30 transition-all duration-200 hover:bg-muted/50">
                              <SelectValue placeholder="Selecione o gênero" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="masculino">Masculino</SelectItem>
                              <SelectItem value="feminino">Feminino</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Info Banner */}
                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">ℹ️ Informação:</span> Os dados exibidos são somente leitura. Para alterações, entre em contato com a administração.
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
