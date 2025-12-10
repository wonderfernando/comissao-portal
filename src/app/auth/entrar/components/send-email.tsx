"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { emailResetShema } from "../interface";
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

export function SendEmailLink() {
    const form = useForm({
        resolver: zodResolver(emailResetShema),
        defaultValues: {
            email: "",
        }
    })
    return (
    <div className="max-w-lg mx-auto my-26  bg-white rounded-xl overflow-hidden shadow-lg p-14 flex flex-col align-center ">
        <h2 className="text-4xl font-bold mb-2 text-center">Esqueceu sua senha?</h2>
        <p className="text-center text-gray-600 text-md">Por favor, insira seu email para receber um link de redefinição de senha.</p>
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => console.log(data))} className="space-y-4 mt-4">
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
          
            <div className="flex flex-col gap-2">
                 <Button type="submit" className="w-full cursor-pointer">Enviar</Button>        
           </div> 
        </form>
    </Form>
    </div>);
}