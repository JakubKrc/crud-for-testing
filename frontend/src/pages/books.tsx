import { useEffect, useState } from "react";
import axios from "axios"

const Books = () => {
    const [books,setBooks] = useState([])

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
 
    return (
        <div>
            <h1>Books</h1>
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