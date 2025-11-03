import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.port || 8080
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})



