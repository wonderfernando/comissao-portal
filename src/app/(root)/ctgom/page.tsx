import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropDownFilterEntity } from "./components/dropdown-filter";

import { SaveCtgomDialog } from "./components/dialog-save-ctgom";
import { TableCtgom } from "./components/table-ctgom";
import { Suspense } from "react"; 
import { Loader } from "../components/loader";
import { BtnPrint } from "../components/btn-print";
import { getCurrentUser } from "../auth";

export default async function Page() {
  const user = await getCurrentUser()
  return (
    <div className=" rounded-md">
      <h1 className="font-semibold text-lg">CTGOM</h1>
      <p className="text-muted-foreground text-sm">Lista de CTGOMs</p>
      <div className="flex justify-between mb-4 mt-8">
        <div className="flex items-center mb-4">
          <Input placeholder="Buscar entidade..." className="mr-2" />
          <div>
            <DropDownFilterEntity />
          </div>
        </div>
        <div>
          <BtnPrint url="imprimir_ctgom" />
          { user?.tipo === "admin_central" &&
            <SaveCtgomDialog>
            <Button size="sm" className="mr-2 cursor-pointer">Registrar CTGOM +</Button>
          </SaveCtgomDialog>}
        </div>
      </div>
      <Suspense fallback={<Loader />}>
        <TableCtgom className="bg-zinc-50" />
      </Suspense>
    </div>
  );
}
