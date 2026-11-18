import express, { type Application, type Request, type Response } from 'express'

const port = 3000
const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to express server!")
})

app.listen(port, () => console.log(`The express server is running on PORT: ${port}`))