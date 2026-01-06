import db from '../db/index.js'

export const addEvent = async (req, res) => {
    const { title, startTime, endTime, eventDate } = req.body;
    if (!title || !startTime || !endTime || !eventDate) return res.status(400).json({ message: 'Missing Fields' });

    try {
        await db.query(
            'INSERT INTO event (title, start_time, end_time, event_date) VALUES ($1, $2, $3, $4)',
            [title, startTime, endTime, eventDate]
        );
        res.status(201).json({ message: 'Event Added Successfully' });

    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getEvents = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM event ORDER BY event_date, start_time');
        res.status(200).json({
            message: 'Events Retrieved Successfully',
            data: result.rows
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}