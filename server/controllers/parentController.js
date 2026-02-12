import db from '../db/index.js'

export const getParentId = async (userId) => {
    const parentResult = await db.query('SELECT id FROM parent WHERE user_id = $1', [userId])
    if(parentResult.rows.length === 0) return null

    return parentResult.rows[0].id
}
export const getChildren = async (req, res) => {
    const parentId = await getParentId(req.user.id)
    if(!parentId) return res.status(400).json({ message : "Parent Id is missing" })
    
    try {
        const studentResult = await db.query(`
                SELECT
                    s.id AS student_id,
                    s.first_name,
                    s.last_name,
                    c.grade,
                    s.student_email,
                    c.name AS class_name,
                    p.name AS parent_name
                    
                FROM student s
                JOIN class c ON c.id = s.class_id
                JOIN parent p ON p.id = $1
                WHERE s.parent_id = $1
            `, [parentId])

        if(studentResult.rows.length === 0) return res.status(404).json({ message : "No child was found" })
        
        res.status(200).json({ 
            message : "Succesfull",
            data: studentResult.rows
         })

    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }

}