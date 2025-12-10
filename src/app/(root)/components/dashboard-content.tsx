"use client"
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Legend, Cell, CartesianGrid } from "recharts";
import { Projeto } from "../projetos/interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getAllProvincias } from "../actions";
import { Building2, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Comissao } from "../comissao-moradores/interface";

interface DashboardContentProps {
    projetos: Projeto[];
    comissoes: Comissao[];
}

export function DashboardContent({ projetos: projetosAprovados, comissoes }: DashboardContentProps) {
    const [selectedProvincia, setSelectedProvincia] = React.useState<string>("all");
    console.log(projetosAprovados)
    const { data: provincias } = useQuery({
        queryKey: ['provincias'],
        initialData: [],
        queryFn: getAllProvincias
    });

    // Filtrar projetos aprovados
  /*   const projetosAprovados = projetos.filter(p => p.estado?.nome?.toLowerCase() === 'aprovado');
 */
    // Últimos 5 projetos aprovados
    const ultimosProjetosAprovados = projetosAprovados.filter(p => p.estado?.id  === 1)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    // Dados para gráfico de categorias (ano ativo)
    const anoAtual = new Date().getFullYear();
    const projetosAnoAtual = projetosAprovados.filter(p =>
        new Date(p.created_at).getFullYear() === anoAtual
    );

    // Agrupar por categoria
    const categoriaData = projetosAnoAtual.reduce((acc, projeto) => {
        const categoria = projeto.ctgom?.nome || 'Outros';
        const custo = parseFloat(projeto.custo_estimado) || 0;

        if (!acc[categoria]) {
            acc[categoria] = { name: categoria, value: 0, count: 0 };
        }
        acc[categoria].value += custo;
        acc[categoria].count += 1;
        return acc;
    }, {} as Record<string, { name: string; value: number; count: number }>);

    const categoriasProjetos = Object.values(categoriaData);

    // Dados para gráfico de custos por município (filtrado por província)
    const projetosFiltrados = selectedProvincia === "all"
        ? projetosAprovados
        : projetosAprovados.filter(p => p.municipio?.provincia_id === parseInt(selectedProvincia));

    const municipioData = projetosFiltrados.reduce((acc, projeto) => {
        const municipio = projeto.municipio?.nome || 'Não especificado';
        const custo = parseFloat(projeto.custo_estimado) || 0;

        if (!acc[municipio]) {
            acc[municipio] = { municipio, custo: 0, projetos: 0 };
        }
        acc[municipio].custo += custo;
        acc[municipio].projetos += 1;
        return acc;
    }, {} as Record<string, { municipio: string; custo: number; projetos: number }>);

    const custosPorMunicipio = Object.values(municipioData)
        .sort((a, b) => b.custo - a.custo)
        .slice(0, 10); // Top 10 municípios

    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57", "#83a6ed"];

    // Estatísticas gerais
    const totalCustoEstimado = projetosAprovados.reduce((sum, p) => sum + (parseFloat(p.custo_estimado) || 0), 0);
    const totalComissoes = comissoes?.length || 0;

    return (
        <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Visão geral dos projetos e estatísticas</p>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Comissões Homologadas</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalComissoes}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total de Comissões de Moradores</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Projetos em execução</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projetosAprovados.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">De {projetosAprovados.length} totais</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Projetos {anoAtual}</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projetosAnoAtual.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total este ano</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Custo Total Estimado</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalCustoEstimado.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 0 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Projetos aprovados</p>
                    </CardContent>
                </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {/* Gráfico de Categorias */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Gastos por Categoria ({anoAtual})</CardTitle>
                        <CardDescription>Distribuição de custos estimados por categoria no ano ativo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categoriasProjetos.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoriasProjetos}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={({ name, count }) => `${name} (${count})`}
                                    >
                                        {categoriasProjetos.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 0 })}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                Sem dados disponíveis para o ano {anoAtual}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Gráfico de Custos por Município */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Custos Estimados por Município</CardTitle>
                        <CardDescription>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm">Filtrar por província:</span>
                                <Select value={selectedProvincia} onValueChange={setSelectedProvincia}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Todas as províncias" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas as províncias</SelectItem>
                                        {provincias.map((provincia) => (
                                            <SelectItem key={provincia.id} value={String(provincia.id)}>
                                                {provincia.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {custosPorMunicipio.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={custosPorMunicipio} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="municipio" type="category" width={100} />
                                    <Tooltip
                                        formatter={(value: number) => value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 0 })}
                                    />
                                    <Bar dataKey="custo" fill="#8884d8" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                Sem dados disponíveis
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Tabela de Últimos Projetos Aprovados */}
            <Card>
                <CardHeader>
                    <CardTitle>Últimos 5 Projetos Aprovados</CardTitle>
                    <CardDescription>Projetos recentemente aprovados no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    {ultimosProjetosAprovados.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Localização</TableHead>
                                        <TableHead>Custo Estimado</TableHead>
                                        <TableHead>Data de Aprovação</TableHead>
                                        <TableHead>Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ultimosProjetosAprovados.map((projeto) => (
                                        <TableRow key={projeto.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                <Link href={`/projetos/${projeto.id}`} className="hover:underline text-primary">
                                                    {projeto.titulo}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{projeto.localizacao || projeto.municipio?.nome}</TableCell>
                                            <TableCell>
                                                {parseFloat(projeto.custo).toLocaleString('pt-AO', {
                                                    style: 'currency',
                                                    currency: 'AOA',
                                                    minimumFractionDigits: 0
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(projeto.created_at).toLocaleDateString('pt-PT', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    {projeto.estado?.nome}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                            Nenhum projeto aprovado encontrado
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
