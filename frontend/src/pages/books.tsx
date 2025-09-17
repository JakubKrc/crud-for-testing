import { useEffect, useState } from "react";
import axios from "axios"
import { createColumnHelper, 
    useReactTable, 
    getCoreRowModel, 
    flexRender,
    type ColumnDef,
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

    const table = useReactTable({
        data: books,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    console.log(table.getHeaderGroups())

    return (
        <div>
            <h1>Books</h1>

            <table>
                <thead>
                    {
                        table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} >
                                        <div>
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

            <div className="books">
                {books.map(book=>(
                    <div className="book" key={book.id}>
                        <h2>{book.name}</h2>
                        <span>{book.price}</span>
                    </div>
                ))}
            </div>
        </div>    
    )
}

export default Books