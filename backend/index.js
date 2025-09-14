import express from 'express'
import mysql from 'mysql2'

const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:"test_user",
    password:"pass123",
    database:"test_1"
})

app.get("/", (req, res )=>{
    res.json("hello hello")
})

app.get("/books", (req,res)=>{
    const q = "SELECT * from books"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

const PORT = 8801;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
}).on("error", (err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})