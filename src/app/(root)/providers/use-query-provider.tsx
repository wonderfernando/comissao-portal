"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Children } from "../interface";

const queryClient = new QueryClient()
export function QueryProvider({ children } : Children) {

     return <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
}