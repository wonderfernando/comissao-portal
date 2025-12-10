import { Check, CheckCheck, CheckIcon, CircleDashed, Loader, LogOut, Pause, Upload, X } from "lucide-react"

export  function retStatus(params:string) {
    if (params === "pendente") return <span className="flex items-center"><CircleDashed className="mr-1" size={14}/> Pendente</span>
    if (params === "devolvido") return <span className="flex items-center"><LogOut size={14}/> Devolvido</span>
    if (params === "Reprovado") return <span className="flex items-center"><X size={14}/> Recusado</span>
    if (params === "Aprovado") return <span className="flex items-center"><CheckIcon size={14}/> Aprovado</span>
    if (params === "execução") return <span className="flex items-center"><Loader size={14}/> Execução</span>
    if (params === "parado") return <span className="flex items-center"><Pause size={14}/> Parado</span>
    if (params === "cancelado") return <span className="flex items-center"><X size={14}/> Cancelado</span>
    if (params === "finalizado") return <span className="flex items-center"><div className="bg-green-800 w-2 h-2 inline-block mr-1"/> Finalizado</span>
    if (params === "Submetida") return <span className="flex items-center"><Check size={14}/> {" "} Submetida</span>
    if (params === "Planejado") return <span className="flex items-center"><Check size={14}/> {" "} Planejado</span>
    
    return <span className="flex items-center"><CircleDashed className="mr-1" size={14}/> Pendente</span>

  }