import express from 'express'
import { Pool } from 'pg';
import cors from 'cors'
import rateLimit from "express-rate-limit"

const app = express();

app.set('trust proxy', 1)

app.use(express.json())

app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.ALLOWED_ORIGINS ?? "";
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}))

const limiter = rateLimit({
  windowMs: 5 * 1000,
  max: 3,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})

if (process.env.NODE_ENV === "production") {
  app.use(limiter);
}

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432
,
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

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app