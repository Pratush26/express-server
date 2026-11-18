import express, { type Application, type Request, type Response } from 'express'
import { Pool } from 'pg'
import config from './config'

const app: Application = express()
const pool = new Pool({connectionString: config.connection_string})

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to express server!")
})

app.listen(config.port, () => console.log(`The express server is running on PORT: ${config.port}`))