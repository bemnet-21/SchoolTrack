import db from '../db/index.js'

export const addGrade = async (req, res) => {
    const { studentId, subjectId, term, score } = req.body
    if(!studentId || !subjectId || !term || !score) return res.status(400).json({ message : "Missing required fields" })

    try {
        const userId = req.user.id
        const teacherData = await db.query(`SELECT id FROM teacher WHERE user_id = $1`, [userId])

        const teacherId = teacherData.rows[0].id

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

        const insertResults = await db.query(`
                INSERT INTO grade
                    (student_id, subject_id, teacher_id, term, score, grade)
                VALUES
                    ($1, $2, $3, $4, $5, $6) RETURNING *
            `, [studentId, subjectId, teacherId, term, score, grade])

        res.status(201).json({ 
            message : "Graded added succesfully",
            data: insertResults.rows
         })

    } catch(err) {
        console.log(err)
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
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'subject', sub.name,
                            'score', g.score,
                            'grade', g.grade
                        )
                    ) AS results
                    FROM grade g
                    JOIN student s ON s.id = g.student_id
                    JOIN class c ON c.id = s.class_id
                    JOIN subject sub ON sub.id = g.subject_id
                    WHERE c.id = $1 AND g.term = $2
                    GROUP BY s.id, s.first_name, s.last_name, g.term`, 
                    [classId, term])

        if(results.rows.length === 0){
            return res.statu(404).json({ message : "No grade was found" })
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