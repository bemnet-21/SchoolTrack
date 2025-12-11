import db from '../db/index.js'

export const addSubject = async (req, res) => {
    const { name } = req.body

    if(!name) {
        return res.status(400).json({ message : "Subject name is required" })
    }

    try {
        const result = await db.query(
            `INSERT INTO subject (name) VALUES($1) RETURNING *`, 
            [name.trim()]
        )

        return res.status(201).json({ 
            message : "Subject added successfully",
            data: result.rows[0]
         })

    } catch(err) {
        console.error(err)
        
        if (err.code === '23505') {
            return res.status(409).json({ message : "Subject already exists" })
        }

        res.status(500).json({ message : "Internal server error" })
    }
}