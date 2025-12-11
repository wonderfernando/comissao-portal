"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginResponseDTO, loginShema } from "../interface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { setCookie } from "@/app/(root)/auth";
import Image from "next/image";

   const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "Mínimo de 6 caracteres" }),
})
type LoginFormValues = z.infer<typeof loginSchema>
  

// 🔁 Simulação de login
const loginUser = async (data: LoginFormValues): Promise<LoginResponseDTO> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/comissao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  
  return res.json()
}

export  function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })
const router = useRouter()
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      console.log("sucedido:", data)
      if (!data.success) {
        toast.error(data.mensagem)
        return
      }
      toast.success("Login bem-sucedido!")
      await setCookie(data.token)
      router.push("/comissao")
    },
    onError: (error) => {
        toast.error("Erro no login. Verifique suas credenciais.")
      console.error("Erro no login:", error)
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values)
  }
    return (
    <div className="p-8  flex flex-col justify-center items-center">
        <div className=" flex flex-col align-center max-w-md"> 
          <Image src="/comissao.png" alt="Logo SISOP" width={150} height={150} className="mb-4 mx-auto"/>     
        <h2 className="text-2xl font-bold mb-2">Poder Local</h2>
        <p className="text-gray-600 text-sm">Bem-vindo ao portal poder local. Por favor, insira suas credenciais para continuar.</p>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Introduza seu email" type="email" {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Palavra-passe</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} placeholder="Introduza a sua Palavra-Passe" />
                        </FormControl>
                        <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                    </FormItem>
                )}
            />
            <div className="text-sm text-right">
                <Link href="#" className="text-blue-600 hover:underline">Esqueceu-se da palavra-passe?</Link>
            </div> 
            <div className="flex flex-col gap-2">
                 <Button type="submit" className="w-full cursor-pointer" disabled={mutation.isPending}>Entrar {mutation.isPending && <Loader2 className="animate-spin" />}</Button>        
            </div> 
        </form>
    </Form>
       </div>
    </div>);
}
