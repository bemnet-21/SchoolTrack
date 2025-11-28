import db from '../db/index.js'
import bcrypt from 'bcrypt'


// register students
export const registerStudents = async (req, res) => {
    let { studentEmail, studentPassword, parentEmail, parentPassword, parentName, parentPhone, studentFirstName, studentLastName, studentGender, studentDob, classId } = req.body

    if (classId === "NULL" || classId === "null") {
        classId = null;
    }

    if (!studentEmail || !studentPassword || !parentEmail || !parentPassword || !parentName || !parentPhone || !studentFirstName || !studentLastName || !studentGender || !studentDob) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    

    const hashedStudentPassword = await bcrypt.hash(studentPassword, 10)
    const hashedParentPassword = await bcrypt.hash(parentPassword, 10)

    const client = await db.connect()
    try {
        await client.query('BEGIN')
        // creating user for students
        const userStudentResult = await client.query(`INSERT INTO users (email, password, role) VALUES ($1, $2, 'STUDENT') RETURNING id`, [studentEmail, hashedStudentPassword])

        const newStudentUserId = userStudentResult.rows[0].id

        // creating user for parent
        const userParentResult = await client.query(`INSERT INTO users (email, password, role) VALUES ($1, $2, 'PARENT') RETURNING id`, [parentEmail, hashedParentPassword])

        const newParentUserId = userParentResult.rows[0].id

        // creating parent
        const newParent = await client.query(`INSERT INTO parent(name, email, phone, user_id) VALUES ($1, $2, $3, $4) RETURNING id`, [
            parentName,
            parentEmail,
            parentPhone,
            newParentUserId
        ])
        const newParentId = newParent.rows[0].id

        // creating student
        const newStudent = await client.query(`INSERT INTO student (first_name, last_name, dob, gender, class_id, parent_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *` , [
            studentFirstName,
            studentLastName,
            studentDob,
            studentGender,
            classId,
            newParentId,
            newStudentUserId
        ])

        await client.query('COMMIT')
        res.status(201).json(newStudent.rows[0])



    } catch(err) {
        await client.query('ROLLBACK')
        res.status(500).json({ message: err.message })
    } finally {
        client.release()
    }
}

//get students
export const getAllStudents = async (req, res) => {
    
}