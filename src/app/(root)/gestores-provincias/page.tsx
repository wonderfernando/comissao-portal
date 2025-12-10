import { Input } from "@/components/ui/input";
import { DropDownFilterEntity } from "../comissao-moradores/components/dropdown-filter";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { SaveCtgomDialog } from "../ctgom/components/dialog-save-ctgom";
import { Suspense } from "react";
import { Loader } from "../components/loader";
import { ContentViewAdmin } from "./componentes/table-admin";
import { SaveAdminMunicipalDialog } from "./componentes/dialog-admin-municipal";


export default function Page() {
  return (
    <div className=" rounded-md">
      <h1 className="font-semibold text-lg">Gestores Provinciais</h1>
      <p className="text-muted-foreground text-sm">Lista de Gestores Provinciais</p>
      <div className="flex justify-between mb-4 mt-8">
        <div className="flex items-center mb-4">
          <Input placeholder="Buscar entidade..." className="mr-2" />
          <div>
              <DropDownFilterEntity />
          </div> 
       </div>
        <div>
      {/*     <Button variant={"outline"} size="sm" className="mr-2">Exportar <Download /></Button>
       */}    <SaveAdminMunicipalDialog>
            <Button size="sm" className="mr-2 cursor-pointer">Registrar Gestor Provincial +</Button>
          </SaveAdminMunicipalDialog>
        </div>
      </div>
      <Suspense fallback={<Loader />}>
        <ContentViewAdmin className="bg-zinc-50" />
      </Suspense>
    </div>
  );
}