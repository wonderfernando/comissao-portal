import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, PhoneIcon, MailIcon, UserIcon } from "lucide-react"

export default function UserProfile({user} : {user: any}) {


  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Perfil */}
      <Card className="shadow-md">
        <CardHeader className="flex items-center gap-4">
          
          <div>
             <div className="flex gap-2 mt-1">
              <Badge variant="default">{user.role}</Badge>
              <Badge variant="outline">{user.user.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 max-md:grid-cols-1 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">📇 Informações Pessoais</h4>
            <p><UserIcon className="inline w-4 h-4 mr-1" /> BI: {user.user.bi}</p>
            <p><MailIcon className="inline w-4 h-4 mr-1" /> Email: {user.user.email}</p>
            <p><PhoneIcon className="inline w-4 h-4 mr-1" /> Telefone: {user.user.number_phone}</p>
            <p><CalendarIcon className="inline w-4 h-4 mr-1" /> Nascimento: {new Date(user.all_infor.perfil.data_nascimento ?? Date.now() ).toLocaleDateString("pt-BR")}</p>
            <p>Gênero: {user.all_infor.perfil.genero}</p>
            <p>Estado Civil: {user.all_infor.perfil.stado_civil}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🏠 Morada</h4>
            <p>{user.all_infor.morada.rua}, {user.all_infor.morada.bairro}</p>
            <p>{user.all_infor.morada.comuna}, {user.all_infor.morada.municipio}</p>
            <p>{user.all_infor.morada.provincia}</p>
            <Separator className="my-2" />
            <p><strong>Natural de:</strong> {user.all_infor.provincia_natural.natural}</p>
          </div>
        </CardContent>
      </Card>

      {/* Documentos */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">🪪 Documentos</CardTitle>
          
          <p><strong>Tipo:</strong> {user.all_infor.documento.tipo_documento}</p>
        </CardHeader>
        <CardContent className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
          <div>
            {user.all_infor.documento.front && (
              <img src={`http://37.27.211.237/user/images/${user.all_infor.documento.front}`} alt="Frente do documento" className="rounded-lg border shadow-sm" />
            )}
          </div>
          <div>
            {user.all_infor.documento.verso && (
              <img src={`http://37.27.211.237/user/images/${user.all_infor.documento.verso}`} alt="Verso do documento" className="rounded-lg border shadow-sm" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profissão */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">💼 Profissão</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
        
          <div>
            <p><strong>Estado Profissional:</strong> {user.all_infor.profissao.stado_profissional}</p>
            <p><strong>Trabalho:</strong> {user.all_infor.profissao.trabalho}</p>
            <p><strong>Empregador:</strong> {user.all_infor.profissao.employer}</p>
          </div>
            <div>
           {/*  <p><strong>Área Acadêmica:</strong> {user.all_infor.profissao.habilitacao_literaria}</p> */}
            <p><strong>Habilitação Literária:</strong> {user.all_infor.profissao.area_academica}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
