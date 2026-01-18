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
        const userResult = await client.query(`INSERT INTO users (email, name, password, role, must_change_password) VALUES ($1, $2, $3, 'TEACHER', 'TRUE') RETURNING *`, [teacherEmail, name, hashedPassword])
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
    const teachersResult = await db.query(`
        SELECT 
            t.id, 
            t.name, 
            t.email, 
            t.phone, 
            s.name as subject_name 
        FROM teacher t 
        LEFT JOIN subject s 
        ON 
            s.id = t.subject_id 
        ORDER BY t.name ASC`)
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

export const updateTeacher = async (req, res) => {
    const { teacherId } = req.params
    if(!teacherId) return res.status(400).json({ message : "Teacher Id is required" })
    const { name, teacherEmail, subject, phone } = req.body
    if(!name || !teacherEmail || !subject || !phone) {
        return res.status(400).json({ message : "Missing Fields" })
    }
    const client = await db.connect()

    try {
        await client.query('BEGIN')
        const teacherMeta = await client.query(`SELECT user_id FROM teacher WHERE id = $1`, [teacherId])
        if(teacherMeta.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({ message : "Teacher not found" })
        }
        const userId = teacherMeta.rows[0].user_id

        await client.query(`UPDATE teacher SET email = $1, name = $2, phone = $3, subject = $4 WHERE id = $5`, [teacherEmail, name, phone, subject, teacherId])
        await client.query(`UPDATE users SET email = $1 WHERE id = $2`, [teacherEmail, userId])
        await client.query('COMMIT')

        res.status(200).json({
            message : "Updated successfully",
            data: {
                name,
                email: teacherEmail,
                phone,
                subject
            }
        })

    } catch(err) {
        await client.query('ROLLBACK')
        console.error("Update Error:", err)

        if (err.code === '23505') {
            return res.status(409).json({ message: "Email already in use by another user" })
        }

        res.status(500).json({ message: "Internal server error" })
    } finally {
        client.release()
    }
}

export const getTeacher = async (req, res) => {

    const { teacherId } = req.params

    try {
        if(req.user.role === 'TEACHER') {
            const userId = req.user.id
            const result = await db.query(`SELECT name, email, phone, subject FROM teacher WHERE user_id = $1`, [userId])

            if(result.rows.length === 0) {
                return res.status(404).json({ message : "Teacher not found" })
            }
            res.status(200).json({ 
                message: "Found",
                data: result.rows[0]
             })
        } else if(req.user.role === 'ADMIN') {
            
            if(!teacherId) return res.status(400).json({ message : "Teacher ID is required" })
            const result = await db.query(`SELECT name, email, subject, phone FROM teacher WHERE id = $1`, [teacherId])
            if(result.rows.length === 0) {
                return res.status(404).json({ message : "Teacher not found" })
            }

            res.status(200).json({ 
                message : "Teacher Found",
                data: result.rows[0]
            })
        }
    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }
}