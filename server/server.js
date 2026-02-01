import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import studentsRoutes from './routes/studentsRoutes.js'
import teachersRoutes from './routes/teachersRoutes.js'
import subjectsRoutes from './routes/subjectsRoute.js'
import classRoutes from './routes/classRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import feeRoutes from './routes/feeRoutes.js'
import timetableRoutes from './routes/timetableRoutes.js'
import gradeRoutes from './routes/gradeRoutes.js'


dotenv.config({ quiet: true })

const app = express()
app.use(express.json())
app.use(cors({
    credentials: true,
}))

const port = process.env.port || 8080
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/students', studentsRoutes)
app.use('/api/v1/teachers', teachersRoutes)
app.use('/api/v1/subjects', subjectsRoutes)
app.use('/api/v1/class', classRoutes)
app.use('/api/v1/attendance', attendanceRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)
app.use('/api/v1/events', eventRoutes)
app.use('/api/v1/fees', feeRoutes)
app.use('/api/v1/timetable', timetableRoutes)
app.use('/api/v1/grade', gradeRoutes)



