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

export const getTimetable = async (req, res) => {
    const { classId } = req.params
    if(!classId) return res.status(400).json({ message : "Class Id is missing" })

    try {
        const results = await db.query(`
                SELECT 
                    t.day_of_week AS day,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'periodNumber', t.period_number,
                            'subjectName', s.name,
                            'startTime', t.start_time,
                            'endTime', t.end_time,
                            'teacherName', tr.name
                        )
                        ORDER BY t.period_number ASC
                    ) AS periods

                    FROM timetable t
                    JOIN subject s ON s.id = t.subject_id
                    JOIN teacher tr ON tr.id = t.teacher_id
                    WHERE class_id = $1
                    GROUP BY t.day_of_week
            `, [classId])
        if(results.rows.length === 0) {
            return res.status(404).json({ message : `Timetable was not found for class ${classId}` })
        }
        res.status(200).json({
            message : "Timetable found",
            data: results.rows
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({ message : "Internal server error" })
    }
}