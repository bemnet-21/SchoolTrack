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