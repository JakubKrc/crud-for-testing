import type { ChangeEvent, MouseEvent } from "react";
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";

const Add = () => {

    const [book, setBook] = useState({
        name: "",
        price: 0
    })

    const navigate = useNavigate()
               
    const handleChange = (e : ChangeEvent<HTMLInputElement>) =>{
        setBook(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    const handleClick = async (e : MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        try{
            await axios.post("http://localhost:8801/books", book)
            navigate("/")
        }catch(err){
            console.log(err)
        }

    }

    console.log(book)
    return (
        <div>
            <div className="form">
                <h1>Add new </h1>
                <input type="text" placeholder="name" onChange={handleChange} name="name"/>  
                <input type="number" placeholder="price" onChange={handleChange} name="price"/>  
            </div>
            <button onClick={handleClick}>Add</button>
            <button><Link to={'/'}>Cancel</Link></button>
        </div>
    )
}

export default Add