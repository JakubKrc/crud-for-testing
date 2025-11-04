import { useEffect, useState } from "react";
import axios from "axios"
import { Link } from "react-router-dom";
import type {Book} from "../types/book"
import BooksTable from "../components/BooksTable";

const Books = () => {

    const [books,setBooks] = useState<Book[]>([])

    useEffect(()=>{
        const fetchAllBooks = async ()=>{
            try{
                const res = await axios.get("http://localhost:3000/books")
                setBooks(res.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchAllBooks()
    },[])

    const handleDelete = async (id: number)=>{
        try{
            await axios.delete("http://localhost:3000/books/"+id)
            setBooks(prev => prev.filter(book => book.id !== id));
        }catch(err){
                console.log(err)
        }
    }

    return (
        <div>
            <h1>Books</h1>

            <BooksTable data={books} onDelete={handleDelete}/>

            <button><Link to={'/add/'}>Add new</Link></button>

        </div>    
    )
}

export default Books