import app from "./app.js"

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
}).on("error", (err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})