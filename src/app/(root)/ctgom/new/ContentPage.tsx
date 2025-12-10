"use client"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { DocumentUploadPage } from "./components/DocumentsUpload"

const formSchema = z.object({
    tipo: z.string().min(1, { message: "Selecione o tipo de entidade." }),
    nome: z.string().min(1, { message: "Informe o nome." }),
    contacto: z.string().min(1, { message: "Informe o contacto." }),
    email: z.email({ message: "Informe um email válido." }),
    genero: z.string().min(1, { message: "Selecione o gênero." }),
    nascimento: z.string().min(1, { message: "Informe a data de nascimento." }),
    nif: z.string().min(1, { message: "Informe o NIF." }),
    provincia: z.string().min(1, { message: "Informe a província." }),
    pais: z.string().min(1, { message: "Informe o país." }),
})

export default function ContentPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "",
      nome: "Milton Alcino Bita",
      contacto: "9376****",
      email: "exemplo@gmail.com",
      genero: "",
      nascimento: "2025-09-30",
      nif: "Av. 21 janeiro",
      provincia: "Luanda",
      pais: "San Jose",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Dados salvos:", values)
  }
 
  return (
    <Tabs defaultValue="dados" className="w-full border rounded-lg shadow">
      <TabsList className="">
        <TabsTrigger className="rounded-b-none data-[state=active]:text-blue-600 data-[state=active]:border-b-blue-600 " value="dados">Dados pessoais</TabsTrigger>
        <TabsTrigger className="rounded-b-none data-[state=active]:text-blue-600 data-[state=active]:border-b-blue-600 " value="documentos">Documentos</TabsTrigger>
        <TabsTrigger className="rounded-b-none data-[state=active]:text-blue-600 data-[state=active]:border-b-blue-600 " value="creditos">Créditos</TabsTrigger>
      </TabsList>

      <TabsContent value="dados" className="px-4 bg-white py-4 rounded-b-2xl">
        <div className="flex gap-6 mt-14">
          <div className="w-56 flex justify-center items-start ">
                <img className="rounded-full"  src="https://github.com/shadcn.png" alt="Foto de perfil" />
            </div>

          <div className="flex-1 ">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de entidade</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="empresa">Empresa</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

               <div className="grid grid-cols-2 gap-2">
 <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contacto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contacto</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               </div>

               <div className="grid grid-cols-2 gap-2">
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
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
                      <FormLabel>Gênero</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
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
 <div className="grid grid-cols-2 gap-2">   
      <FormField
                  control={form.control}
                  name="nascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nif"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIF</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
 </div>
                
 <div className="grid grid-cols-2 gap-2"> 
      <FormField
                  control={form.control}
                  name="provincia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Província</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />  
    </div>
              

                <Button type="submit">Salvar</Button>
              </form>
            </Form>
          </div>
        </div>
      </TabsContent>

      <TabsContent className="px-4 bg-white py-4 rounded-b-2xl " value="documentos">
       <DocumentUploadPage />
      </TabsContent>

      <TabsContent value="creditos">
        <p>Conteúdo da aba Créditos...</p>
      </TabsContent>
    </Tabs>
  )
}