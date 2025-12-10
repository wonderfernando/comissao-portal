
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormFields } from "./formFields"
import { DocumentUploadPage } from "./DocumentsUpload"

export function ComissaoForm() {
    

    
    return (
        <Tabs defaultValue="dados" className="">
          <TabsList className="">
              <TabsTrigger className="rounded-none data-[state=active]:text-zinc-900 data-[state=active]:border-b-zinc-900 " value="dados">Dados da Comissão</TabsTrigger>
              <TabsTrigger className="rounded-none data-[state=active]:text-zinc-900 data-[state=active]:border-b-zinc-900 " value="documentos">Documentos</TabsTrigger>
          </TabsList>
          <TabsContent value="dados" className=" ">
            <FormFields />
          </TabsContent>
           <TabsContent value="documentos" className="h-screen flex-1 flex">
                <DocumentUploadPage />
          </TabsContent>
      </Tabs>
    )
}
