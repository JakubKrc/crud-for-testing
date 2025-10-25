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
import type {Book} from "../types/book"
import styles from "../components/BooksTable.module.css"


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

    const minRows = table.getState().pagination.pageSize
    const rows = table.getRowModel().rows
    const dummyRows = Array.from({ length: Math.max(0, minRows - rows.length)})

    return (
        <div className={styles.wrapper}>
            <input className={styles.search}
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
            />

            <table className={styles.table}>
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
                                <th>Functions</th>
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
                    {dummyRows.map((_, id) => (
                        <tr key={`dummy-${id}`}>
                        <td colSpan={columns.length+1}>&nbsp;</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.footer}>
                <div className={styles.pagination}>
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
                </div>

                <div>
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
        </div>
    )
}

export default BooksTable