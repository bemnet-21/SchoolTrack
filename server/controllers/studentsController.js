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

    const client = await db.connect()
    try {
        await client.query('BEGIN')
        // creating user for students
        const userStudentResult = await client.query(`INSERT INTO users (email, password, role) VALUES ($1, $2, 'STUDENT') RETURNING id`, [studentEmail, hashedStudentPassword])

        const newStudentUserId = userStudentResult.rows[0].id
    
        let parentId
        // check if parent already exists
        const existingParent = await client.query(`SELECT id FROM parent WHERE email = $1`, [parentEmail])
        if(existingParent) {
            parentId = existingParent.rows[0].id
        } else {
            // creating user for parent

            const hashedParentPassword = await bcrypt.hash(parentPassword, 10)
            const userParentResult = await client.query(`INSERT INTO users (email, password, role) VALUES ($1, $2, 'PARENT') RETURNING id`, [parentEmail, hashedParentPassword])
    
            const newParentUserId = userParentResult.rows[0].id
    
            // creating parent
            const newParent = await client.query(`INSERT INTO parent(name, email, phone, user_id) VALUES ($1, $2, $3, $4) RETURNING id`, [
                parentName,
                parentEmail,
                parentPhone,
                newParentUserId
            ])
            parentId = newParent.rows[0].id
        }

        // creating student
        const newStudent = await client.query(`INSERT INTO student (first_name, last_name, dob, gender, class_id, parent_id, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *` , [
            studentFirstName,
            studentLastName,
            studentDob,
            studentGender,
            classId,
            parentId,
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

//get students per class
export const getAllStudents = async (req, res) => {
    const { classId } = req.params

    if(!classId) return res.status(400).json({ message : "Class Id is required" })

    try {
        const result = await db.query(`SELECT s.first_name, s.last_name, s.dob, s.gender FROM student s LEFT JOIN class r ON s.class_id = $1`, [classId])

        const studentResult = result.rows
        if(!studentResult) {
            return res.status(404).json({ message : "No student found in this class" })
        }
        res.status(200).json({ 
            message : "Found",
            data: studentResult
         })

    } catch {

    }

}

// update student profile
export const updateStudent = async (req, res) => {
    const { studentId } = req.params
    if(!studentId) return res.status(400).json({ message : "Student Id is required" })
    
    let { studentEmail, parentEmail,  parentName, parentPhone, studentFirstName, studentLastName, studentGender, studentDob, classId } = req.body

    if (classId === "NULL" || classId === "null") {
        classId = null;
    }

    if (!studentEmail || !parentEmail || !parentName || !parentPhone || !studentFirstName || !studentLastName || !studentGender || !studentDob) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const client = await db.connect()
    try {
        await client.query('BEGIN')
        const updatedStudent = await client.query(`UPDATE student SET first_name = $1, last_name = $2, gender = $3, dob= $4 WHERE id = $5 RETURNING *`, [ studentFirstName, studentLastName, studentGender, studentDob, studentId])

        const studentMeta = await client.query(`SELECT parent_id, user_id FROM student WHERE id = $1`, [studentId])
        // const { parent_id: parentId, user_id: studentUserId } = studentMeta
        const parentId = studentMeta.rows[0].parent_id
        const studentUserId = studentMeta.rows[0].user_id

        const updatedStudentUser = await client.query(`UPDATE users SET email = $1 WHERE id = $2`, [studentEmail, studentUserId])

        if(updatedStudent.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({ message : "Student was not found" })
        }
        const updatedParent = await client.query(`UPDATE parent SET email = $1, name = $2, phone = $3 WHERE id = $4 RETURNING *`, [parentEmail, parentName, parentPhone, parentId])
        const parentMeta = await client.query(`SELECT user_id FROM parent WHERE id = $1`, [parentId])

        const parentUserId = parentMeta.rows[0].user_id

        const updatedParentUser = await client.query(`UPDATE users SET email = $1 WHERE id = $2`, [parentEmail, parentUserId])

        if(updatedParent.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({ message : "Parent was not found" })
        }

        await client.query('COMMIT')
        res.status(200).json({ message : "Updated successfully" })
    } catch(err) {
        await client.query('ROLLBACK')
        res.status(500).json({ message: err.message })
        console.log(err)
    } finally {
        client.release()
    }
}

// delete student
export const deleteStudent = async (req, res) => {
    
}