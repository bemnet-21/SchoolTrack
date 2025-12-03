import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import studentsRoutes from './routes/studentsRoutes.js'
import teachersRoutes from './routes/teachersRoutes.js'

dotenv.config({ quiet: true })

const app = express()
app.use(express.json())
app.use(cors())

const port = process.env.port || 8080
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/students', studentsRoutes)
app.use('/api/v1/teachers', teachersRoutes)


