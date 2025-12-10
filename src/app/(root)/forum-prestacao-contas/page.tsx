import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropDownFilterEntity } from "./components/dropdown-filter";

import { SaveForumDialog } from "./components/dialog-save-forum";
import { TableForumContribuicao } from "./components/contentPage";
import { Suspense } from "react";
import { Loader } from "../components/loader";
import { BtnPrint } from "../components/btn-print";
import { getCurrentUser } from "../auth";

export default async function Page() {

  const user = await getCurrentUser()
  return (
    <div className=" rounded-md">
      <h1 className="font-semibold text-lg">Fórum Prestação de Contas</h1>
      <p className="text-muted-foreground text-sm">Prestação de Contas</p>
      <div className="flex justify-between mb-4 mt-8">
        <div className="flex items-center mb-4">
          <Input placeholder="Buscar entidade..." className="mr-2" />
          <div>
            <DropDownFilterEntity />
          </div>
        </div>
        <div>
          <BtnPrint url="imprimir_forum_prestacao_conta" />  
          {user?.tipo === "admin_municipal" && <SaveForumDialog>
            <Button size="sm" className="mr-2 cursor-pointer">Registrar +</Button>
          </SaveForumDialog>}
        </div>
      </div>
      <Suspense fallback={<Loader />}>
        <TableForumContribuicao className="bg-zinc-50" />
      </Suspense>
    </div>
  );
}
