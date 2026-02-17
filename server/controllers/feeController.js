import db from '../db/index.js';
import { getParentId } from './parentController.js';

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


export const getUnpaidFeeForStudent = async (req, res) => {
    const { studentId } = req.query;
    
    try {
        const parentId = await getParentId(req.user.id);
        console.log(parentId)
        
        if (!studentId || !parentId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        
        const childCheck = await db.query(
            'SELECT id FROM student WHERE id = $1 AND parent_id = $2',
            [studentId, parentId]
        );

        if (childCheck.rows.length === 0) {
            return res.status(403).json({ message: "Unauthorized: This student is not linked to your account." });
        }

        const feeResult = await db.query(`
                SELECT
                    id,
                    term,
                    year,
                    invoice_no,
                    amount::float, 
                    due_date,      
                    start_date
                FROM fee
                WHERE student_id = $1 AND is_paid = false
                ORDER BY due_date ASC
            `, [studentId]);

        res.status(200).json({
            message: "Unpaid fees retrieved successfully",
            data: feeResult.rows
        });

    } catch (err) {
        console.error("Get Unpaid Fees Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const getFeeForChildren = async (req, res) => {
    try {
        const parentId = await getParentId(req.user.id);
        const { isPaid } = req.query; 

        if (!parentId || isPaid === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const query = `
            SELECT
                f.id,
                f.term,
                f.year,
                f.invoice_no,
                f.amount::float, 
                f.due_date,      
                f.start_date,
                f.is_paid,
                s.first_name AS student_first_name,
                s.last_name AS student_last_name
            FROM fee f
            JOIN student s ON f.student_id = s.id
            WHERE s.parent_id = $1 AND f.is_paid = $2
            ORDER BY f.due_date ASC
        `;

        const results = await db.query(query, [parentId, isPaid]);

        res.status(200).json({
            message: `Retrieved ${isPaid === 'true' ? 'paid' : 'unpaid'} fees`,
            data: results.rows
        });

    } catch (err) {
        console.error("Get children fees error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};



export const initializePayment = async (req, res) => {
    const { amount, email, phone, first_name, last_name, invoiceNo } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
    }

    try {
        const { rows } = await db.query('SELECT invoice_no FROM fee WHERE invoice_no = $1', [invoiceNo]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        const invoice = rows[0].invoice_no

        const tx_ref = `${invoice}-${Date.now()}`;
        const response = await fetch(
        "https://api.chapa.co/v1/transaction/initialize",
        {
            method: "POST",
            headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            amount: amount.toString(),
            currency: "ETB",
            tx_ref: tx_ref,
            callback_url: "https://schooladmin-wtgo.onrender.com/api/v1/fees/webhook",
            return_url: "https://yourapp.com/success",
            customer: {
                email,
                phone_number: phone, // ✅ correct key
                first_name,
                last_name
            },
            meta: {
                invoice_no: invoice
            },
            customizations: {
                title: "School Fee Payment",
                description: `Payment for invoice ${invoiceNo}`,
            }
            }),
        }
        );

        const data = await response.json();

        if (!response.ok) {
        return res.status(response.status).json({
            message: "Payment initialization failed",
            error: data,
        });
        }

        

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyPayment = async (req, res) => {
    const { tx_ref } = req.params;
    try {
        const response = await fetch(
        `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
        {
            method: "GET",
            headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            },
        }
        );
        const verifyData = await response.json();
        if(verifyData.status === 'success' && verifyData.data.status === 'success') {
            const invoiceNo = verifyData.data.meta.invoice_no;
            await db.query('UPDATE fee SET is_paid = true WHERE invoice_no = $1', [invoiceNo]);
            return res.status(200).json(verifyData);
        } else {
            return res.status(400).json({ message: "Payment verification failed", data: verifyData });
        }
    } catch (err) {
        console.error("Verify payment error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const chapaWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-chapa-signature'];
        const secretHash = process.env.CHAPA_WEBHOOK_KEY;
        if(!signature || signature !== secretHash) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { tx_ref, status, meta} = req.body;
        if(status === 'success') {
            const invoiceNo = meta?.invoice_no;
            if(invoiceNo) {
                await db.query('UPDATE fee SET is_paid = true WHERE invoice_no = $1', [invoiceNo]);
                console.log(`WEBHOOK: Invoice ${invoiceNo} marked as paid. `)
            }
        }
        res.status(200).json({ message: "Webhook received" });

    } catch(err) {
        console.error("Chapa webhook error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}