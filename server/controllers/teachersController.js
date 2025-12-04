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
            data : teacher,
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

// get all teachers
export const getAllTeachers = async (req, res) => {
    const teachersResult = await db.query(`SELECT name, email, subject , phone FROM teacher`)
    if(teachersResult.rows.length === 0) {
        return res.status(404).json({ message : "No teachers found" })
    }

    res.status(200).json({ 
        message : "Teachers Found",
        data: teachersResult.rows
     })
}

export const deleteTeacher = async (req, res) => {
    const { teacherId } = req.params
    if(!teacherId) return res.status(400).json({ message : "Teacher Id is required" })

    const client = await db.connect()
    try {
        await client.query('BEGIN')
        const teacherMeta = await client.query(`SELECT user_id FROM teacher WHERE id = $1`, [teacherId])
        if(teacherMeta.rows.length === 0) {
            client.query('ROLLBACK')
            return res.status(404).json({ message : 'Teacher not found' })
        }
        const userId = teacherMeta.rows[0].user_id

        await client.query(`DELETE FROM users WHERE id = $1`, [userId])
        await client.query('COMMIT')

        res.status(200).json({ message : "Deleted successfully" })
    } catch(err) {
        client.query('ROLLBACK')
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    } finally {
        client.release()
    }
}