import db from '../db/index.js'
import format from "pg-format"

export const createTimeTable = async (req, res) => {
    const { classId, day, periods } = req.body
    if(!classId || !day || !periods) return res.status(400).json({ message : "Missing fields" })
    
    if(periods.length !== 7) {
        return res.status(400).json({ message : "Periods are required to be 7" })
    }

    const client = await db.connect()
    
    try {
        await client.query('BEGIN')
        await client.query('DELETE FROM timetable WHERE class_id = $1 AND day_of_week = $2', [classId, day])

        const values = []

        for(const p of periods) {
            const { periodNumber, teacherId, subjectId, startTime, endTime } = p
            if(!periodNumber || !teacherId || !subjectId || !startTime || !endTime) {

                await client.query('ROLLBACK')
                return res.status(400).json({ message : `Missing field for period ${periodNumber}` })
            }

            values.push([
                classId,
                day,
                periodNumber,
                teacherId,
                subjectId,
                startTime,
                endTime
            ])
        }

        const insertQuery = format(`
            INSERT INTO timetable
                (class_id, day_of_week, period_number, teacher_id, subject_id, start_time, end_time)
            VALUES %L RETURNING *
            `, values)
        const result = await client.query(insertQuery)

        await client.query('COMMIT')
        res.status(201).json({
            message : "Timetable updated successfully",
            data: result.rows
        })
        

    } catch(err) {
        await client.query('ROLLBACK')
        console.log(err)
        res.status(500).json({ message : "Internal Server error" })
    } finally {
        client.release()
    }
}