import db from '../db/index.js'
import crypto from 'crypto'
import bcrypt from 'bcrypt'

//register teachers
export const registerTeachers = async (req, res) => {
    const { name, teacherEmail, subjectId, teacherPhone } = req.body
    if(!name || !teacherEmail || !subjectId || !teacherPhone) return res.status(400).json({ message : "Missing Fields" })
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

        const teacherResult = await client.query(`INSERT INTO teacher (name, email, subject_id, phone, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [name, teacherEmail, subjectId, teacherPhone, userId])
        const teacher = teacherResult.rows[0]
        if(!teacher) {
            return res.status(400).json({ message : "Failed to register teacher" })
        }

        res.status(201).json({
            message : "Registered Successfully",
            data : teacher,
            credentials: {
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
            const result = await db.query(`
                SELECT 
                    t.name AS teacherName, 
                    email AS teacherEmail, 
                    phone AS teacherPhone, 
                    s.name AS subject 
                FROM teacher t 
                JOIN subject s 
                ON t.subject_id = s.id
                WHERE user_id = $1`, 
                 [userId])

            if(result.rows.length === 0) {
                return res.status(404).json({ message : "Teacher not found" })
            }
            res.status(200).json({ 
                message: "Found",
                data: result.rows[0]
             })
        } else if(req.user.role === 'ADMIN') {
            
            if(!teacherId) return res.status(400).json({ message : "Teacher ID is required" })
            const result = await db.query(`SELECT 
                    t.name AS teacherName, 
                    email AS teacherEmail, 
                    phone AS teacherPhone, 
                    s.name AS subject 
                FROM teacher t 
                JOIN subject s 
                ON t.subject_id = s.id
                WHERE t.id = $1`, [teacherId])
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

// helper function
const getTeacherId = async (userId) => {
    const teacherData = await db.query(
        `SELECT id FROM teacher WHERE user_id = $1`, 
        [userId]
    );
    
    if (teacherData.rows.length === 0) {
        return null;
    }

    return teacherData.rows[0].id;
}
export const getClassForTeacher = async (req, res) => {
    try {

        const teacherId = await getTeacherId(req.user.id)
        const classResult = await db.query(`
                SELECT
                    c.name,
                    c.id,
                    COUNT(s.id)::integer AS student_count
                FROM class c
                JOIN student s ON s.class_id = c.id
                WHERE c.teacher_id = $1
                GROUP BY c.name, c.id
                `, [teacherId])
        
        if(classResult.rows.length === 0) return res.status(404).json({ message : "No class was found" })
        
        res.status(200).json({
            message : "Class was found succuesfully",
            data: classResult.rows
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }
}

export const getTodaySchedule = async (req, res) => {
    try {
        const teacherId = await getTeacherId(req.user.id)
        const date = new Date()
        const today = date.toLocaleString('en-US', { weekday: 'long' })

        const scheduleResult = await db.query(`
                SELECT
                    c.name,
                    t.period_number::integer,
                    t.start_time,
                    t.end_time,
                    sub.name AS subject
                FROM timetable t
                JOIN class c ON c.id = t.class_id
                JOIN subject sub ON sub.id = t.subject_id
                WHERE t.teacher_id = $1 AND t.day_of_week = $2
            `, [teacherId, today])
        
        if(scheduleResult.rows.length === 0) {
            return res.status(404).json({ message : "No schedule for today" })
        }

        res.status(200).json({ 
            message : "Schedule found succesfully",
            data: scheduleResult.rows
         })
        

    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }
}

export const getClassesForTeacher = async (req, res) => {
    const teacherId = await getTeacherId(req.user.id)

    try {
        const results = await db.query(`
                SELECT
                    c.name,
                    c.id AS class_id,
                    sub.name AS subject
                FROM class_subjects cs
                JOIN class c ON cs.class_id = c.id
                JOIN subject sub ON cs.subject_id = sub.id
                WHERE cs.teacher_id = $1
            `, [teacherId])

        if(results.rows.length === 0) return res.status(404).json({ message : "Class not found" })
        
        res.status(200).json({ 
            message : "Class was found succesfully",
            data: results.rows
         })

    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }


}