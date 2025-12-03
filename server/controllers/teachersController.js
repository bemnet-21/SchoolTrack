import db from '../db/index.js'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

//register teachers
export const registerTeachers = async (req, res) => {
    const { name, teacherEmail, subject, teacherPhone } = req.body
    if(!name || !teacherEmail || !subject || !teacherPhone) return res.status(400).json({ message : "Missing Fields" })
    const client = await db.connect()

    try {
        const generatedTeacherPassword = crypto.randomBytes(4).toString('hex')
        const hashedPassword = await bcrypt.hash(generatedTeacherPassword, 10)
        // create user for teacher
        const userResult = await client.query(`INSERT INTO users (email, password, role, must_change_password) VALUES ($1, $2, 'TEACHER', 'TRUE') RETURNING *`, [teacherEmail, hashedPassword])
        const user = userResult.rows[0]
        if(!user) {
            return res.status(400).json({ message : "Failed to add user" })
        }
        const userId = user.id

        const teacherResult = await client.query(`INSERT INTO teacher (name, email, subject, phone, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, teacherEmail, subject, teacherPhone, userId])
        const teacher = teacherResult.rows[0]
        if(!teacher) {
            return res.status(400).json({ message : "Failed to register teacher" })
        }

        res.status(201).json({
            message : "Registered Successfully",
            teacherData : teacher,
            credentails: {
                email: teacherEmail,
                temporaryPassword: generatedTeacherPassword
            }
        })

        await client.query('COMMIT')
    } catch(err) {
        await client.query('ROLLBACK')
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    } finally {
        client.release()
    }
}