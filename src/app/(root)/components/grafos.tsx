"use client"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar, Doughnut } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export function Grafos() {
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Débito",
        data: [1200, 1100, 980, 1300, 900, 1050, 1030],
        backgroundColor: "#1e3a8a",
      },
      {
        label: "Crédito",
        data: [800, 950, 870, 1000, 920, 890, 990],
        backgroundColor: "#60a5fa",
      },
    ],
  }

  const doughnutData = {
    labels: ["Interno", "Empresa", "Externo"],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: ["#1e3a8a", "#22c55e", "#14b8a6"],
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
    
      {/* Gráfico de Débito e Crédito */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Visão geral de Exemplo e exemplares</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            $7.560 investidos e $5.420 creditados nesse ano
          </p>
          <Bar data={barData} />
        </CardContent>
      </Card>

      {/* Gráfico de Estatísticas de Despesas */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de despesas</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Doughnut data={doughnutData} />
        </CardContent>
      </Card>
    </div>
  )
}
