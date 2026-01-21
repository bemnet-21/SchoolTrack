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

export const getSubject = async (req, res) => {
    const { subjectId } = req.params
    if(!subjectId) return res.status(400).json({ message : "Subject ID is required" })

    try {
        const result = await db.query(`SELECT name FROM subject WHERE id = $1`, [subjectId])
        if(result.rows.length === 0) {
            return res.status(404).json({ message : "Subject not found" })
        }
        res.status(200).json({ 
            message: "Subject found",
            data: result.rows[0]
         })
    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }
}

export const getAllSubject = async (req, res) => {
    try {
        const result = await db.query(`SELECT id, name FROM subject`)
        if(result.rows.length === 0) {
            return res.json({ message : "No subject" })
        }

        res.status(200).json({ 
            message : "Subjects found",
            data: result.rows
         })

    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal Server error" })
    }
}

export const updateSubject = async (req, res) => {
    const { subjectId } = req.params
    const { name } = req.body
    if(!subjectId) return res.status(400).json({ message : "Subject ID is required" })
    if(!name) return res.status(400).json({ message : "Missing field" })

    try {
        const result = await db.query(`UPDATE subject SET name = $1 WHERE id = $2 RETURNING *`, [name, subjectId])
        if(result.rows.length === 0) {
            return res.status(404).json({ message : "Subject not found" })
        }

        res.status(200).json({ 
            message : "Updated successfully", 
            data: result.rows[0]
         })

    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }
}