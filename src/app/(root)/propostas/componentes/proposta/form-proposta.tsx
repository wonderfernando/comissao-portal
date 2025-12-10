
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormFields } from "./form-fields"
import { DocumentUploadPage } from "./DocumentsUpload"
import FileUpload from "../docments"


export function PropostaForm() {

  return (
    <Tabs defaultValue="dados" className="">
      <TabsList className="">
        <TabsTrigger className="rounded-none data-[state=active]:text-white data-[state=active]:rounded-sm data-[state=active]:bg-primary  data-[state=active]:border-b-zinc-900 " value="dados">Dados da Comissão</TabsTrigger>
        <TabsTrigger className="rounded-none data-[state=active]:text-white data-[state=active]:rounded-sm data-[state=active]:bg-primary  data-[state=active]:border-b-zinc-900 " value="documentos">Documentos</TabsTrigger>
      </TabsList>
      <TabsContent value="dados" className=" ">
        <FormFields />
      </TabsContent>
      <TabsContent value="documentos" className="h-screen flex-1 flex">
        <FileUpload />
      </TabsContent>
    </Tabs>
  )
}
