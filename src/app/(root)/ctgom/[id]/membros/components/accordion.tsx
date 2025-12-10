"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { TableMembers } from "./table-members"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {DocumentosMandato} from "./actas"

import { Mandato } from "../../../interface"
 

export default function AccordionComponent({ mandatos }: { mandatos: Mandato[] }) {
  console.log(mandatos)
  return (
    <div className="space-y-4">
    {/*   <h2 className="text-xl font-bold">W/ chevron</h2> */}
      <Accordion type="single" collapsible className="w-full">
        {mandatos.map((mandato, index) => (
          <AccordionItem value={mandato.id.toString()} key={mandato.id} className="py-2">
            <AccordionTrigger className="hover:underline py-2 text-[15px] leading-6 cursor-pointer">
               <span>De: {new Date(mandato?.data_inicio).toLocaleString("pt-PT", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",

              })}
              {" "}
              a
              {" "}
              {new Date(mandato?.data_fim || "").toLocaleString("pt-PT", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",

              })}
              </span>
             
              
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-2 bg-white border shadow p-1 rounded">
              
             
                <Tabs key={mandato.id} defaultValue={"membros"} className="w-full">
                  <TabsList className="bg-gray-100 rounded-t-md mb-4">
                    <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:border-b-0" value={"membros"}>Membros</TabsTrigger>
                    <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:border-b-0" value={"actas"}>Documentos</TabsTrigger>
                 
                  </TabsList>
                   <TabsContent  value={"membros"}>
                      <TableMembers members={mandato.membros} />
                  </TabsContent> 
                    <TabsContent  value={"actas"}>
                      <DocumentosMandato documentos={mandato?.documentos} />
                  </TabsContent> 
                </Tabs>
             
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
