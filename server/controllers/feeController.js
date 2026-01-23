import db from '../db/index.js';

export const assignFees = async (req, res) => {
    const { term, year, amount, startDate, dueDate, classId } = req.body;
    if(!term || !year || !amount || !startDate || !dueDate) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const studentResult = await client.query(`
            SELECT
                id
            FROM student
            WHERE class_id = $1`, 
            [classId]);
        const students = studentResult.rows;
        if(students.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'No students found for the specified class.' });
        }

        for (const student of students) {
            const date = new Date();
            const currentYear = date.getFullYear();
            const invoiceNo = `INV-${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`;
            await client.query(`
                INSERT INTO fee (student_id, term, year, amount, start_date, due_date, is_paid, invoice_no)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [student.id, term, year, amount, startDate, dueDate, false, invoiceNo]);
        }

        await client.query('COMMIT');
        res.status(200).json({ message: 'Fees assigned successfully to all students in the class.' });

    } catch(err) {
        console.error('Error assigning fees:', err);
        await client.query('ROLLBACK');
        res.status(500).json({ message : 'Internal server error.' });
    } finally {
        client.release();
    }
}

export const getFeesByTerm = async (req, res) => {
    const { term, year } = req.query;
    try {
        const result = await db.query(`
            SELECT 
                f.id,
                f.amount, 
                f.start_date, 
                f.due_date, 
                f.is_paid,
                f.invoice_no,
                s.first_name,
                s.last_name,
                p.phone AS parent_phone
            FROM fee f
            JOIN student s ON f.student_id = s.id
            JOIN parent p ON s.parent_id = p.id
            WHERE term = $1 AND year = $2
        `, [term, year]);

        if(result.rows.length === 0) {
            return res.status(404).json({ message: 'No fees found for the specified term and year.' });
        }
        res.status(200).json({
            message : 'Fees retrieved successfully.',
            data: result.rows
        });
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.' });
    }
}