import db from '../db/index.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'


// register students
export const registerStudents = async (req, res) => {
    let { studentEmail, parentEmail, parentName, parentPhone, studentFirstName, studentLastName, studentGender, studentDob, classId } = req.body

    if (classId === "NULL" || classId === "null") {
        classId = null;
    }

    if (!studentEmail || !parentEmail || !parentName || !parentPhone || !studentFirstName || !studentLastName || !studentGender || !studentDob) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    


    const client = await db.connect()
    try {
        await client.query('BEGIN')
        // creating user for students

        const generatedStudentPassword = crypto.randomBytes(4).toString('hex')
        const hashedStudentPassword = await bcrypt.hash(generatedStudentPassword, 10)

        const userStudentResult = await client.query(`INSERT INTO users (email, name, password, role, must_change_password) VALUES ($1, $2, $3, 'STUDENT', 'TRUE') RETURNING id`, [studentEmail, studentFirstName + " " + studentLastName, hashedStudentPassword])

        const newStudentUserId = userStudentResult.rows[0].id
    
        let parentId
        let generatedParentPassword = null
        // check if parent already exists
        const existingParent = await client.query(`SELECT id FROM parent WHERE email = $1`, [parentEmail])
        if(existingParent.rows.length > 0) {
            parentId = existingParent.rows[0].id
        } else {
            // creating user for parent
            generatedParentPassword = crypto.randomBytes(4).toString('hex')
            const hashedParentPassword = await bcrypt.hash(generatedParentPassword, 10)
            const userParentResult = await client.query(`INSERT INTO users (email, password, role, must_change_password) VALUES ($1, $2, 'PARENT', 'TRUE') RETURNING id`, [parentEmail, hashedParentPassword])
    
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
        res.status(201).json({
            message : "Registration Successful",
            data: newStudent.rows[0],
            credentials: {
                student: {
                    email: studentEmail,
                    temporaryPassword: generatedStudentPassword
                },
                parent: generatedParentPassword ? {
                    email: parentEmail,
                    temporaryPassword: generatedParentPassword
                } : {
                    message : "Parent already existed, no password change."
                }
            }
        })



    } catch(err) {
        await client.query('ROLLBACK')
        console.log(err)
        res.status(500).json({ message : "Internal server error"})
    } finally {
        client.release()
    }
}

//get students per class
export const getAllStudentsPerClass = async (req, res) => {
    const { classId } = req.params

    if(!classId) return res.status(400).json({ message : "Class Id is required" })

    try {
        const result = await db.query(`SELECT id, first_name AS studentFirstName, last_name AS studentLastName, dob AS studentDob, gender AS studentGender, created_at AS joined FROM student WHERE class_id = $1 ORDER BY first_name ASC`, [classId])

        const studentResult = result.rows
        if(!studentResult) {
            return res.status(404).json({ message : "No student found in this class" })
        }
        res.status(200).json({ 
            message : "Found",
            data: studentResult
         })

    } catch(err) {
        res.status(500).json({ message: err.message })
        console.log(err)
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
    const { studentId } = req.params
    if(!studentId) return res.status(400).json({ message : "Student Id is required" })

    const client = await db.connect()    
    try {
        await client.query('BEGIN')
        const studentMeta = await client.query(`SELECT user_id FROM student WHERE id = $1`, [studentId])
        if(studentMeta.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({ message : "Student not found" })
        }
        await client.query(`DELETE FROM users WHERE id = $1`, [studentMeta.rows[0].user_id])
        await client.query('COMMIT')
        res.status(200).json({ message : "Deleted Successfully" })
    } catch(err) {
        await client.query('ROLLBACK')
        console.log(err)
        res.status(500).json({ message: err.message })
    } finally {
        client.release()
    }
}

// get student profile 

export const getStudentProfile = async (req, res) => {
    try {
        let { studentId } = req.params 
        const user = req.user

        if (user.role === 'ADMIN') {
            if (!studentId) {
                return res.status(400).json({ message: "Student Id is required" })
            }
        } 
        else if (user.role === 'STUDENT') {
            const studentMeta = await db.query(`SELECT id FROM student WHERE user_id = $1`, [user.id])
            
            if (studentMeta.rows.length === 0) {
                return res.status(404).json({ message: "Student profile not found" })
            }
            studentId = studentMeta.rows[0].id
        } 
        else if (user.role === 'PARENT') {
            if (!studentId) {
                return res.status(400).json({ message: "Student Id is required" })
            }

            const parentMeta = await db.query(`SELECT id FROM parent WHERE user_id = $1`, [user.id])
            if (parentMeta.rows.length === 0) {
                return res.status(404).json({ message: "Parent profile not found" })
            }
            const parentId = parentMeta.rows[0].id

            const checkOwnership = await db.query(
                `SELECT id FROM student WHERE id = $1 AND parent_id = $2`, 
                [studentId, parentId]
            )

            if (checkOwnership.rows.length === 0) {
                return res.status(403).json({ message: "You are not authorized to view this student profile" })
            }
        }

        const result = await db.query(`
            SELECT 
                s.id, s.first_name AS studentFirstName, s.last_name AS studentLastName, s.dob AS studentDob, s.gender AS studentGender, s.address AS studentAddress,
                c.name AS class, c.grade AS grade, 
                p.name AS parentName, p.phone AS parentPhone, p.email AS parentEmail
            FROM student s 
            LEFT JOIN class c ON s.class_id = c.id 
            LEFT JOIN parent p ON s.parent_id = p.id 
            WHERE s.id = $1`, 
            [studentId]
        )

        const studentDetail = result.rows[0]

        if (!studentDetail) {
            return res.status(404).json({ message: "Student Not Found" })
        }

        res.status(200).json({ 
            message: "Student Found",
            data: studentDetail
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getParentChildren = async (req, res) => {
    try {
        const user = req.user


        // 1. Find the Parent Profile ID using the User ID
        const parentMeta = await db.query(`SELECT id FROM parent WHERE user_id = $1`, [user.id])
        
        if (parentMeta.rows.length === 0) {
            return res.status(404).json({ message: "Parent profile not found" })
        }
        const parentId = parentMeta.rows[0].id

        const result = await db.query(`
            SELECT 
                s.id, 
                s.first_name, 
                s.last_name, 
                s.gender, 
                c.name AS class_name, 
                c.grade 
            FROM student s
            LEFT JOIN class c ON s.class_id = c.id
            WHERE s.parent_id = $1
            ORDER BY s.first_name ASC`, 
            [parentId]
        )

        res.status(200).json({ 
            message: "Children Found",
            data: result.rows 
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getAllStudents = async (req, res) => {
    try {
        const results = await db.query(`SELECT s.id, s.first_name AS studentFirstName, s.last_name AS studentLastName, s.dob AS studentDob, s.gender AS studentGender, s.created_at AS joined, c.name AS class FROM student s LEFT JOIN class c ON s.class_id = c.id ORDER BY CAST(c.grade AS INTEGER) ASC, s.first_name ASC`)
        
        res.status(200).json({ 
            message : "Students found",
            data: results.rows
         })

    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }
}