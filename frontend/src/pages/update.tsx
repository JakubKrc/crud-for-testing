import { useParams } from "react-router-dom"
import type { ChangeEvent, MouseEvent } from "react";
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Update = () => {

    const { id }  = useParams<{ id: string }>()

    const [book, setBook] = useState({
        name: "",
        price: 0
    })

    useEffect(()=>{
        const fetchBook = async () => {
            try{
                const res = await axios.get("http://localhost:3000/books/"+id)
                setBook(res.data)
            }catch(err){
                console.log(err)
            }
        }
        fetchBook()
    }, [id])

    const navigate = useNavigate()
               
    const handleChange = (e : ChangeEvent<HTMLInputElement>) =>{
        setBook(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    const handleClick = async (e : MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try{
            await axios.put("http://localhost:3000/books/"+id, book)
            navigate("/")
        }catch(err){
            console.log(err)
        }

    }

    return (
        <div>
            <div className="form">
                <h1>Edit</h1>
                <input type="text" placeholder="name" onChange={handleChange} name="name" value={book.name}/>  
                <input type="number" placeholder="price" onChange={handleChange} name="price" value={book.price}/>  
            </div>
            <button onClick={handleClick}>Save</button>
        </div>
    )
}

export default Update