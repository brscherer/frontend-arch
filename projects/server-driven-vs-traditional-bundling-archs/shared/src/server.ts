import express from "express"
import cors from "cors"
import { getSchema } from "./steps.js"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/api/wizard/schema", (req, res) => {
  const plan = req.query.plan as string | undefined
  const schema = getSchema(plan)
  res.json(schema)
})

app.post("/api/wizard/submit", (req, res) => {
  console.log("Wizard submitted:", JSON.stringify(req.body, null, 2))
  res.json({ status: "ok", message: "Account created successfully!" })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})
