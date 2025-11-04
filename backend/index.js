import express from 'express'
import { Pool } from 'pg';
import cors from 'cors'

const app = express();

app.use(express.json())
app.use(cors())

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT || 5432,
});

app.get("/", (req, res )=>{
    res.json("hello hello")
})

app.get("/books", (req,res)=>{
    const q = "SELECT * FROM books"
    pool.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data.rows)
    })
})

app.get("/books/:id", (req,res)=>{
    const bookId = req.params.id
    const q = "SELECT * FROM books WHERE id = $1"
    pool.query(q, [bookId], (err,data)=>{
        if(err) return res.json(err)
        return res.json(data.rows[0])
    })
})

app.post("/books", (req,res)=>{
  const q = "INSERT INTO books (name, price) VALUES ($1, $2)"
  const values = [req.body.name, req.body.price]

  pool.query(q, values, (err,data)=>{
    if(err) return res.json(err)
    return res.json("Book has been created succesfully.")
  })
})

app.put("/books/:id", (req,res)=>{
  const bookId = req.params.id
  const q = "UPDATE books SET name = $1, price = $2 WHERE id = $3"

  const values=[req.body.name, req.body.price, bookId]

  pool.query(q,values, (err, data)=>{
    if(err) return res.json(err)
    return res.json("Book has been deleted succesfully.")
  })
})

app.delete("/books/:id", (req,res)=>{
  const bookId = req.params.id
  const q = "DELETE FROM books WHERE id=$1"

  pool.query(q,[bookId], (err, data)=>{
    if(err) return res.json(err)
    return res.json("Book has been deleted succesfully.")
  })
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
}).on("error", (err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})