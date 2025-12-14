import db from '../db/index.js'

export const markAttendance = async (req, res) => {
    const { date, records } = req.body; 
    // records : {
    //     status, 1 - present, 0-absent, 2-permission
    //     studentId
    // }


    const client = await db.connect();
    try {
        await client.query('BEGIN');
        
        for (const record of records) {
            await client.query(
                `INSERT INTO attendance (student_id, date, status) VALUES ($1, $2, $3)`,
                [record.studentId, date, record.status]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: "Attendance marked" });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}