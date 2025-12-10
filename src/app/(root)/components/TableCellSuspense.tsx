"use client"
import { TableCell } from "@/components/ui/table";
import { Children } from "../interface";
 import {useTopLoader} from 'nextjs-toploader';
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function TableCellSuspense({children, href}: Children & {href?: string}) {
   const router = useRouter()
   const loader = useTopLoader();
   const [isPending, startTransition] = useTransition()
    function onClick() {
        startTransition(async () => {
            loader.start();
           await  new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
                router.push(href || "#")
            })
        })
    }
    return (
      <TableCell onClick={onClick} className=" cursor-pointer" >
        {isPending ? <div className="flex gap-2 items-center"> <Loader2 size={16} className="animate-spin" /> {children}</div> : children}
      </TableCell>
   )
}