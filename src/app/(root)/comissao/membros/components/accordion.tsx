"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { TableMembers } from "./table-members"
import { Mandato } from "@/app/(root)/comissao-moradores/interface"
 
 
export default function AccordionComponent({ mandatos }: { mandatos: Mandato[] }) {
  console.log(mandatos)
  return (
    <div className="space-y-4">
      {/*   <h2 className="text-xl font-bold">W/ chevron</h2> */}
      <Accordion type="single" collapsible className="w-full">
        {mandatos.map((mandato, index) => (
          <AccordionItem value={mandato.id.toString()} key={mandato.id} className="py-2">
            <AccordionTrigger className="hover:underline py-2 text-[15px] leading-6 cursor-pointer">
              <span>De: {new Date(mandato?.data_inicio.split("T")?.[0]).toLocaleString("pt-pt", {
                day: "2-digit",
               month: "2-digit",
                year: "numeric", 
              })} a {new Date(mandato?.data_fim.split("T")?.[0]).toLocaleString("pt-pt", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-2 bg-white border shadow p-1 rounded">
              <TableMembers members={mandato.membro} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
