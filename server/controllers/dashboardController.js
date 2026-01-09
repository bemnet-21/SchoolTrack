import db from '../db/index.js'

export const getDashboardStats = async (req, res) => {
    try {
        const totalStudentsResult = await db.query('SELECT COUNT(*) AS total_students FROM student')
        const totalTeachersResult = await db.query('SELECT COUNT(*) AS total_teachers FROM teacher')
        const totalClassesResult = await db.query('SELECT COUNT(*) AS total_classes FROM class')

        const stats = {
            totalStudents: totalStudentsResult.rows[0].total_students,
            totalTeachers: totalTeachersResult.rows[0].total_teachers,
            totalClasses: totalClassesResult.rows[0].total_classes
        }

        res.status(200).json({ stats })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const getStudentPerformance = async (req, res) => {
    const { grade } = req.query
    if(!grade) return res.status(400).json({ message : "Grade is required" })

    try {
        const query = `
            SELECT
                sub.name AS subject,
                CAST(ROUND(AVG(g.score)) AS INTEGER) AS average
            FROM grade g
            JOIN subject sub ON g.subject_id = sub.id
            JOIN student s ON g.student_id = s.id
            JOIN class c ON s.class_id = c.id
            WHERE c.grade = $1
            GROUP BY sub.name
            ORDER BY average DESC;
        `

        const results = await db.query(query, [grade])

        if(results.rows.length === 0) {
            return res.status(404).json({ message : "No performance has been found" })
        }

        res.status(200).json({ 
            message : "Success",
            data: results.rows
         })



    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal Server Error" })
    }
}