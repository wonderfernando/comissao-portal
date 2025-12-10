import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropDownFilterEntity } from "./components/dropdown-filter";

import { SaveComissaoDialog } from "./components/dialog-save-comissao";
import { ContentPage } from "./components/content-page";

import { BtnPrint } from "../components/btn-print";

export default function Page() {

  return (
    <div className=" rounded-md">
      <h1 className="font-semibold text-lg">Comissão de Moradores</h1>
      <p className="text-muted-foreground text-sm">Lista de Comissões de Moradores</p>
      <div className="flex justify-between mb-4 mt-8">
        <div className="flex items-center mb-4">
          <Input placeholder="Buscar entidade..." className="mr-2" />
          <div>
            <DropDownFilterEntity />
          </div>
        </div>
        <div> 
          <BtnPrint url="comissao/imprimir" />
          {<SaveComissaoDialog>
            <Button size="sm" className="mr-2 cursor-pointer">Registrar Comissão +</Button>
          </SaveComissaoDialog>}
        </div>
      </div>
      <ContentPage />
    </div>
  );
}
