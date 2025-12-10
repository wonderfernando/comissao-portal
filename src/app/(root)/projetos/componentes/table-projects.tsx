"use client"

import { useId, useState } from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import {
    ChevronDownIcon,
    ChevronUpIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TableCellSuspense } from "@/app/(root)/components/TableCellSuspense"
import { Badge } from "@/components/ui/badge"

import { usePathname } from "next/navigation"
import { Projeto } from "../interface"
import { retStatus } from "../../ctgom/utils"

export const columns: ColumnDef<Projeto>[] = [
    {
        accessorKey: "titulo",
        header: "Título",
    },
    {
        accessorKey: "descricao",
        header: "Descrição",
        cell: ({ row }) => (
            <div className="max-w-sm truncate" title={row.getValue("descricao")}>
                {row.getValue("descricao")}
            </div>
        ),
    },
    {
        accessorKey: "custo",
        header: "Custo Estimado",
        cell: ({ row }) => <span>{
            Number(row.original?.custo).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })
        }</span>,
    },
    {
        accessorKey: "localizacao",
        header: "Localização",
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => (
            <Badge variant="outline" className="capitalize">
                {retStatus(row.original.estado.nome)}
            </Badge>
        ),
    },
    {
        accessorKey: "ano",
        header: "Ano",
        cell: ({ row }) => <span>{row.original?.ano?.split("-")?.[0]}</span>,
    },
    {
        accessorKey: "created_at",
        header: "Criado em",
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"))
            return date.toLocaleDateString("pt-AO")
        }
    }
]

export default function TableProjectos({ className = "", projetos }: { className?: string, projetos: Projeto[] }) {
     const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "titulo",
            desc: false,
        },
    ])

    const table = useReactTable({
        data: projetos,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        enableSortingRemoval: false,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            pagination,
        },
    })

    const url = usePathname()

    return (
        <div className="space-y-4 w-full  flex-1">
            <div className="w-full bg-background overflow-hidden rounded-md border">
                <Table className={cn("table-fixed", className)}>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: `${header.getSize()}px` }}
                                            className="h-11"
                                        >
                                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                <div
                                                    className={cn(
                                                        header.column.getCanSort() &&
                                                        "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    onKeyDown={(e) => {
                                                        // Enhanced keyboard handling for sorting
                                                        if (
                                                            header.column.getCanSort() &&
                                                            (e.key === "Enter" || e.key === " ")
                                                        ) {
                                                            e.preventDefault()
                                                            header.column.getToggleSortingHandler()?.(e)
                                                        }
                                                    }}
                                                    tabIndex={header.column.getCanSort() ? 0 : undefined}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: (
                                                            <ChevronUpIcon
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                        desc: (
                                                            <ChevronDownIcon
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            ) : (
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        if (cell.column.id === "titulo") {
                                            return (
                                                <TableCellSuspense href={`${url}/${projetos?.[index]?.id}`} key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCellSuspense>
                                            )
                                        }
                                        return (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Sem resultados. Clica em "Adicionar Projeto" para criar o primeiro projeto.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
