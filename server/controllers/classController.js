import db from '../db/index.js'

export const createClass = async (req, res) => {
    const { name, grade, teacherId } = req.body
    if(!name || !grade || !teacherId) return res.status(400).json({ message : "Missing fields" })
    try {
        const result = await db.query(
            `INSERT INTO class (name, grade, teacher_id) VALUES ($1, $2, $3) RETURNING *`,
            [name, grade, teacherId]
        );
        res.status(201).json({ message: "Class created", data: result.rows[0] })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const getClassDetails = async (req, res) => {
    const { classId } = req.params
    if(!classId) return res.status(400).json({ message : "Class ID is required" })
    
    try {
        const result = await db.query(`
        SELECT 
            c.name, 
            c.grade, 
            t.name as teacher_name, 
            (SELECT COUNT(*) 
        FROM student s 
        WHERE s.class_id = c.id) as student_count 
        FROM class c 
        LEFT JOIN teacher t ON c.teacher_id = t.id 
        WHERE c.id = $1
        ORDER BY c.name ASC`, [classId])

        if(result.rows.length === 0) {
            return res.status(404).json({ message : "Class not found" })
        }

        res.status(200).json({ 
            message : "Found",
            data: result.rows[0]
         })


    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }
}

export const assignTeacher = async (req, res) => {
    const { classId } = req.params;
    const { teacherId } = req.body;

    if(!classId) return res.status(400).json({ message : "Class ID is required" })
    if(!teacherId) return res.status(400).json({ message : "Teacher ID is required" })
    

    try {
        const result = await db.query(
            `UPDATE class SET teacher_id = $1 WHERE id = $2 RETURNING *`,
            [teacherId, classId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Class not found" });
        }

        res.status(200).json({
            message: "Teacher assigned successfully",
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        if (err.code === '23503') {
            return res.status(400).json({ message: "Teacher ID does not exist" });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

// get classId
export const getClassId = async (req, res) => {
    const { grade } = req.query
    if(!grade) return res.status(400).json({ message : "Grade is required" })

    try {
        const result = await db.query(
            `SELECT id, name FROM class WHERE grade = $1`,
            [grade]
        );
        res.status(200).json({ 
            message: "Success",
            classId: result.rows[0].id
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllClasses = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                c.id, 
                c.name, 
                c.grade, 
                t.name as 
                teacher_name, 
                (SELECT COUNT(*) FROM student s WHERE s.class_id = c.id) as student_count 
                FROM class c 
                LEFT JOIN teacher t 
                ON c.teacher_id = t.id
                ORDER BY CAST(c.grade AS INTEGER) ASC`);

        if(result.rows.length === 0) {
            return res.status(404).json({ message : "No classes found" })
        }

        res.status(200).json({ 
            message: "Success",
            data: result.rows
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }  
}

export const assignSubjectsToClass = async (req, res) => {
    const { classId, subjects } = req.body
    if(!classId || !Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ message : "Missing required fields" })
    }
    // subjects = [
    //     {
    //         subjectId,
    //         teacherId
    //     }
    // ]
    const client = await db.connect()
    try {
        for(const item of subjects) {
            await client.query('BEGIN')
            const { subjectId, teacherId } = item
            if(!subjectId || !teacherId) return res.status(400).json({ message : "Missing required fields" })
            
            await client.query(`INSERT INTO class_subjects(class_id, subject_id, teacher_id) VALUES ($1, $2, $3)`, [classId, subjectId, teacherId]) 
        }

        await client.query('COMMIT')
        res.status(201).json({ message : "Subjects assigned to class successfully" })


    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }

}