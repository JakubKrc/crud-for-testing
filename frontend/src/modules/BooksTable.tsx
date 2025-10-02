import { useState } from "react";
import { createColumnHelper, 
    useReactTable, 
    getCoreRowModel, 
    flexRender,
    type ColumnDef,
    type SortingState,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import type {Book} from "../types/book.ts"

const columnHelper = createColumnHelper<Book>()

const columns: ColumnDef<Book, any>[] = [
    columnHelper.accessor("id", {
        cell: (info) => info.getValue(),
        header: ()=>(
            <span>ID</span>
        ),
    }),
    columnHelper.accessor("name", {
        cell: (info) => info.getValue(),
        header: ()=>(
            <span>NAME</span>
        ),
    }),
    columnHelper.accessor("price", {
        cell: (info) => info.getValue(),
        header: ()=>(
            <span>PRICE</span>
        ),
    })
]

const BooksTable = ({data, onDelete}: {data : Book[], onDelete: (id: number) => void }) => {

const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState("")

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter
        },
        initialState: {
            pagination: {
                pageSize: 10
            }
        },
        getCoreRowModel: getCoreRowModel(),

        getPaginationRowModel:getPaginationRowModel(),

        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),

        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel()
    })

    return (
        <div>
            <input 
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
            />

            <table>
                <thead>
                    {
                        table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} >
                                        <div 
                                            style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                                            onClick= {header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </div>
                                    </th>
                                ))

                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody>
                    {
                        table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                                <td>
                                    <button onClick={()=>onDelete(row.original.id)}>Delete</button>
                                    <button><Link to={`/update/${row.original.id}`}>Edit</Link></button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <div>
                <span>Items per page</span>
                <select value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[5, 10, 20, 30].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<<"}
                </button>

                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {"<"}
                </button>

                <span>
                    <input
                        min={1}
                        max={table.getPageCount()}
                        type="number"
                        value={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                    />
                    <span>of {table.getPageCount()}</span>
                </span>

                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {">"}
                </button>

                <button
                    onClick={() => table.setPageIndex(table.getPageCount()-1)}
                    disabled={!table.getCanNextPage()}
                >
                    {">>"}
                </button>

            </div>
        </div>
    )
}

export default BooksTable