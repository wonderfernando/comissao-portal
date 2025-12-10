"use client"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Forum } from "../../interface"
import { DollarSign, TrendingUp, Calendar, MapPin, FileText, BarChart3 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"


export function RelatorioFinanceiroView({ dados }: { dados: Forum | null }) {
    if (!dados) {
        return (
            <div className="mx-auto py-10 px-4">
                <Card>
                    <CardContent className="py-10">
                        <p className="text-center text-muted-foreground">Nenhum dado disponível</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Extract year from forum data
    const ano = new Date(dados.data_inicio).getFullYear()

    // Calculate total estimated cost from all proposals - PRESTAÇÃO DE CONTAS usa forun_prestacao_contas
    const propostas = dados.forun_prestacao_contas || []
    const totalCusto = propostas.reduce((acc, item: any) => {
        const custo = item?.projeto?.custo_estimado || "0"
        return acc + Number(custo)
    }, 0)

    // Group by priority
    const propostasPorPrioridade = propostas.reduce((acc: any, item: any) => {
        const prioridade = item.prioridade || "sem prioridade"
        if (!acc[prioridade]) {
            acc[prioridade] = []
        }
        acc[prioridade].push(item)
        return acc
    }, {})

    const getPriorityBadge = (priority: string) => {
        switch (priority.toLowerCase()) {
            case "alta":
                return <Badge variant="outline" className="border-red-600 text-red-600">Alta</Badge>
            case "media":
            case "média":
                return <Badge variant="outline" className="border-amber-600 text-amber-600">Média</Badge>
            case "baixa":
                return <Badge variant="outline" className="border-green-600 text-green-600">Baixa</Badge>
            default:
                return <Badge variant="outline">{priority}</Badge>
        }
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA',
            minimumFractionDigits: 2
        }).format(value)
    }

    // Prepare data for chart
    const chartData = Object.entries(propostasPorPrioridade).map(([prioridade, items]: [string, any]) => ({
        prioridade: prioridade.charAt(0).toUpperCase() + prioridade.slice(1),
        quantidade: items.length,
        prioridadeOriginal: prioridade.toLowerCase()
    }))

    // Color mapping for chart bars
    const getBarColor = (prioridade: string) => {
        switch (prioridade.toLowerCase()) {
            case "alta":
                return "#dc2626" // red-600
            case "media":
            case "média":
                return "#d97706" // amber-600
            case "baixa":
                return "#16a34a" // green-600
            default:
                return "#6b7280" // gray-500
        }
    }

    // Group by category
    const propostasPorCategoria = propostas.reduce((acc: any, item: any) => {
        const categoriaNome = item?.projeto?.categoria?.nome || "Sem categoria"
        if (!acc[categoriaNome]) {
            acc[categoriaNome] = []
        }
        acc[categoriaNome].push(item)
        return acc
    }, {})

    // Prepare data for category chart
    const chartDataCategoria = Object.entries(propostasPorCategoria).map(([categoria, items]: [string, any], index) => ({
        categoria: categoria,
        quantidade: items.length,
        color: `hsl(${(index * 360) / Object.keys(propostasPorCategoria).length}, 70%, 50%)`
    }))

    // Color palette for category bars
    const getCategoryColor = (index: number, total: number) => {
        const hue = (index * 360) / total
        return `hsl(${hue}, 70%, 50%)`
    }


    return (
        <div className="mx-auto py-10 px-4 space-y-6">
            {/* Header Card */}
            <Card className="border-2">
                <CardHeader className="">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-3xl font-bold flex items-center gap-2">
                                <FileText className="w-8 h-8" />
                                Relatório Financeiro
                            </CardTitle>
                            <CardDescription className="text-lg mt-2">
                                {dados.titulo}
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                            Ano {ano}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Local:</span>
                            <span className="font-medium">{dados.local}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Período:</span>
                            <span className="font-medium">
                                {new Date(dados.data_inicio).toLocaleDateString("pt-PT")} - {new Date(dados.data_fim).toLocaleDateString("pt-PT")}
                            </span>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Total Estimated Cost Card */}
            <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground font-medium">
                                Valor estimado a ser gasto para o ano {ano}
                            </p>
                            <p className="text-4xl font-bold text-primary flex items-center gap-2">
                                <DollarSign className="w-8 h-8" />
                                {formatCurrency(totalCusto)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <TrendingUp className="w-12 h-12" />
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Total de Projectos</p>
                            <p className="text-2xl font-semibold">{propostas.length}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Custo Médio por Projecto</p>
                            <p className="text-2xl font-semibold">
                                {propostas.length > 0 ? formatCurrency(totalCusto / propostas.length) : formatCurrency(0)}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Município</p>
                            <p className="text-2xl font-semibold">{dados.municipio?.nome || "N/A"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Projects by Priority */}
           {/*  {Object.keys(propostasPorPrioridade).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Distribuição por Prioridade</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(propostasPorPrioridade).map(([prioridade, items]: [string, any]) => {
                                const custoTotal = items.reduce((acc: number, item: any) => {
                                    return acc + Number(item?.proposta?.custo_estimado || 0)
                                }, 0)

                                return (
                                    <Card key={prioridade} className="border-2">
                                        <CardContent className="pt-6">
                                            <div className="space-y-2">
                                                {getPriorityBadge(prioridade)}
                                                <p className="text-2xl font-bold">{formatCurrency(custoTotal)}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {items.length} {items.length === 1 ? 'projecto' : 'projectos'}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )} */}

            {/* Projects by Category */}
            {Object.keys(propostasPorCategoria).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Distribuição por Categoria</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(propostasPorCategoria).map(([categoria, items]: [string, any], index) => {
                                const custoTotal = items.reduce((acc: number, item: any) => {
                                    return acc + Number(item?.proposta?.custo_estimado || 0)
                                }, 0)

                                return (
                                    <Card key={categoria} className="border-2">
                                        <CardContent className="pt-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: getCategoryColor(index, Object.keys(propostasPorCategoria).length) }}
                                                    ></div>
                                                    <Badge variant="outline">{categoria}</Badge>
                                                </div>
                                                <p className="text-2xl font-bold">{formatCurrency(custoTotal)}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {items.length} {items.length === 1 ? 'projecto' : 'projectos'}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Chart - Comparison by Priority */}
            {chartData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Comparação de Projectos por Prioridade
                        </CardTitle>
                        <CardDescription>
                            Visualização da quantidade de projectos em cada nível de prioridade
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="prioridade"
                                    className="text-sm"
                                    tick={{ fill: 'currentColor' }}
                                />
                                <YAxis
                                    className="text-sm"
                                    tick={{ fill: 'currentColor' }}
                                    label={{ value: 'Quantidade de Projectos', angle: -90, position: 'insideLeft' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '6px'
                                    }}
                                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                                    formatter={(value: any) => [`${value} projectos`, 'Quantidade']}
                                />
                                <Bar dataKey="quantidade" radius={[8, 8, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getBarColor(entry.prioridadeOriginal)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
                                <span className="text-sm text-muted-foreground">Alta Prioridade</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#d97706' }}></div>
                                <span className="text-sm text-muted-foreground">Média Prioridade</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#16a34a' }}></div>
                                <span className="text-sm text-muted-foreground">Baixa Prioridade</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Chart - Comparison by Category */}
            {chartDataCategoria.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Comparação de Projectos por Categoria
                        </CardTitle>
                        <CardDescription>
                            Visualização da quantidade de projectos em cada categoria
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartDataCategoria} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="categoria"
                                    className="text-sm"
                                    tick={{ fill: 'currentColor' }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis
                                    className="text-sm"
                                    tick={{ fill: 'currentColor' }}
                                    label={{ value: 'Quantidade de Projectos', angle: -90, position: 'insideLeft' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '6px'
                                    }}
                                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                                    formatter={(value: any) => [`${value} projectos`, 'Quantidade']}
                                />
                                <Bar dataKey="quantidade" radius={[8, 8, 0, 0]}>
                                    {chartDataCategoria.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getCategoryColor(index, chartDataCategoria.length)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                        <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
                            {chartDataCategoria.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: getCategoryColor(index, chartDataCategoria.length) }}
                                    ></div>
                                    <span className="text-sm text-muted-foreground">{entry.categoria}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Detailed Projects Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Detalhamento de Projectos</CardTitle>
                    <CardDescription>Lista completa de projectos aprovados e seus custos estimados</CardDescription>
                </CardHeader>
                <CardContent>
                    {propostas.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">Nenhum projecto registrado</p>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">#</TableHead>
                                        <TableHead>Título do Projecto</TableHead>
                                        <TableHead>Categoria</TableHead>
                                          <TableHead className="text-right">Custo Estimado</TableHead>
                                        <TableHead>Data de Criação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {propostas.map((item: any, index: number) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell className="font-medium">
                                                {item?.projeto?.titulo || "Sem título"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {item?.projeto?.categoria?.nome || "Sem categoria"}
                                                </Badge>
                                            </TableCell>
                                             <TableCell className="text-right font-semibold">
                                                {formatCurrency(Number(item?.projeto?.custo_estimado || 0))}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(item.created_at).toLocaleDateString("pt-PT")}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-muted/50 font-bold">
                                        <TableCell colSpan={4} className="text-right">Total Geral:</TableCell>
                                        <TableCell className="text-right text-lg">
                                            {formatCurrency(totalCusto)}
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Footer Info */}
            <Card className="bg-muted/50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <h3 className="font-semibold mb-2">Informações Adicionais</h3>
                            <p className="text-sm text-muted-foreground">
                                Este relatório apresenta o valor total estimado para os projectos aprovados no fórum de prestação de contas
                                realizado em {dados.local}, município de {dados.municipio?.nome}.
                            </p>
                            {dados.descricao && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    <strong>Descrição:</strong> {dados.descricao}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
