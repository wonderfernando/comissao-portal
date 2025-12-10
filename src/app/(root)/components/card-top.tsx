// Dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FileText, AlertTriangle } from "lucide-react"

export  function CardList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 w-full">
      {/* Total Pedidos Pendentes */}
      <Card>
        <CardHeader className="flex items-center gap-4">
          <Package className="text-blue-500" size={32} />
          <CardTitle>Total Pedidos Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">123</p>
        </CardContent>
      </Card>

      {/* Nº de Contratos Ativos */}
      <Card>
        <CardHeader className="flex items-center gap-4">
          <FileText className="text-green-500" size={32} />
          <CardTitle>Nº de Projects Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">2334</p>
        </CardContent>
      </Card>

      {/* Clientes em Inadimplemento */}
      <Card>
        <CardHeader className="flex items-center gap-4">
          <AlertTriangle className="text-red-500" size={32} />
          <CardTitle>CM Homologadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">10%</p>
        </CardContent>
      </Card>
    </div>
  )
}
