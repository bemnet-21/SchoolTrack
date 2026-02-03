import db from '../db/index.js'
import { getStudentId } from './studentsController.js'
import { getTeacherId } from './teachersController.js'

export const addGrade = async (req, res) => {
    const { studentId, classId, term, score } = req.body
    
    if(!studentId || !classId || !term || !score) return res.status(400).json({ message : "Missing required fields" })

    const client = await db.connect()
    const teacherId = await getTeacherId(req.user.id)    //helper function from teachersController
    try {
        await client.query('BEGIN')
        const subjectData = await client.query(`SELECT subject_id FROM class_subjects WHERE teacher_id = $1 AND class_id = $2`, [teacherId, classId])

        if(subjectData.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({ message : "Subject not found" })
        }
        const subjectId = subjectData.rows[0].subject_id

        const grade = score >= 85 ? 'A'
                        : (score >=80 && score < 85) ? 'A-'
                        : (score >= 75 && score < 80) ? 'B+'
                        : (score >= 70 && score < 75) ? 'B'
                        : (score >= 65 && score < 70) ? 'B-'
                        : (score >= 60 && score < 65) ? 'C+'
                        : (score >= 55 && score < 60) ? 'C'
                        : (score >= 50 && score < 55) ? 'C-'
                        : (score >= 40 && score < 50) ? 'D'
                        : 'F'

        const insertResults = await client.query(`
                INSERT INTO grade
                    (student_id, subject_id, teacher_id, term, score, grade)
                VALUES
                    ($1, $2, $3, $4, $5, $6) RETURNING *
            `, [studentId, subjectId, teacherId, term, score, grade])

        await client.query('COMMIT')

        res.status(201).json({ 
            message : "Graded added succesfully",
            data: insertResults.rows
         })

    } catch(err) {
        console.log(err)
        await client.query('ROLLBACK')
        res.status(500).json({ message : "Internal server error" })
    }
}

export const getGrade = async (req, res) => {
    try {
        const { classId, term } = req.query
        if(!classId || !term) return res.status(400).json({ message : "Class Id and term are required" })
        
        const results = await db.query(`
                SELECT
                    s.id AS student_id,
                    s.first_name,
                    s.last_name,
                    g.term,
                    c.grade,
                    SUM(g.score)::float AS total,
                    ROUND(AVG(g.score)::numeric, 2)::float AS overall_average,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'subject', sub.name,
                            'score', g.score,
                            'grade', g.grade
                        )
                    ) AS grades
                    FROM grade g
                    JOIN student s ON s.id = g.student_id
                    JOIN class c ON c.id = s.class_id
                    JOIN subject sub ON sub.id = g.subject_id
                    WHERE c.id = $1 AND g.term = $2
                    GROUP BY s.id, s.first_name, s.last_name, g.term, c.grade`, 
                    [classId, term])

        if(results.rows.length === 0){
            return res.status(404).json({ message : "No grade was found" })
        }

        res.status(200).json({ 
            message : "Grade was found succesfully",
            data: results.rows
         })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getGradeForStudent = async (req, res) => {
    const { term } = req.query
    const studentId = await getStudentId(req.user.id)
    if(!studentId || !term) return res.status(400).json({ message : "Student Id and term are required" })

    try {
        const gradeResults = await db.query(`
                SELECT
                    sub.name AS subject,
                    g.score::integer,
                    g.grade,
                    t.name AS teacher
                FROM grade g
                JOIN subject sub ON sub.id = g.subject_id
                JOIN teacher t ON t.id = g.teacher_id
                WHERE student_id = $1 AND term = $2
            `, [studentId, term])
        if(gradeResults.rows.length === 0) return res.status(404).json({ message : "No grade was found" })
        
        res.status(200).json({ 
            message : "Grade found",
            data: gradeResults.rows
         })

    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }
}