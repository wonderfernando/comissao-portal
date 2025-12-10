 import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { DropDownFilterEntity } from "../comissao-moradores/components/dropdown-filter";
import { DialogSaveAno } from "./components/dialog-save-ano";
import { ContentPage } from "./components/content-page";


export default function Page() {
  return (
    <div className="px-4 rounded-md">
      <h1 className="font-semibold text-lg">Ano de actividade</h1>
      <p className="text-muted-foreground text-sm">Lista de anos de actividade</p>
      <div className="flex justify-between mb-4 mt-8">
        <div className="flex items-center mb-4">
          <Input placeholder="Buscar entidade..." className="mr-2" />
          <div>
              <DropDownFilterEntity />
          </div> 
       </div>
        <div>
          <Button variant={"outline"} size="sm" className="mr-2">Exportar <Download /></Button>
        <DialogSaveAno>
          <Button>Registrar ano de actividade +</Button>
        </DialogSaveAno>
        </div>
      </div>
    <ContentPage />
    </div>
  );
}
