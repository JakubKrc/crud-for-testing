import { useEffect, useState } from "react";
import axios from "axios"
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


type Book = {
  id: number
  name: string
  price: number
}

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

const Books = () => {

    const [books,setBooks] = useState<Book[]>([])

    useEffect(()=>{
        const fetchAllBooks = async ()=>{
            try{
                const res = await axios.get("http://localhost:8801/books")
                setBooks(res.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchAllBooks()
    },[])

    const handleDelete = async (id: number)=>{
        try{
            await axios.delete("http://localhost:8801/books/"+id)
            setBooks(prev => prev.filter(book => book.id !== id));
        }catch(err){
                console.log(err)
        }
    }

    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState("")

    const table = useReactTable({
        data: books,
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
            <h1>Books</h1>

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
                                    <button onClick={()=>handleDelete(row.original.id)}>Delete</button>
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

            <button><Link to={'/add/'}>Add new</Link></button>

        </div>    
    )
}

export default Books