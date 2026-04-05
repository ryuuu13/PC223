const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gymnatorium',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ========== BOOKING ENDPOINTS ==========

// GET all bookings
app.get('/api/bookings', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM bookings ORDER BY created_at DESC');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET single booking
app.get('/api/bookings/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
        connection.release();
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// CREATE new booking
app.post('/api/bookings', async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            event_type,
            other_event_type,
            check_in,
            check_out,
            time_in,
            time_out,
            number_of_guests,
            days_duration
        } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !email || !phone || !event_type || !check_in || !check_out || !number_of_guests) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            `INSERT INTO bookings 
            (first_name, last_name, email, phone, event_type, other_event_type, check_in, check_out, time_in, time_out, number_of_guests, days_duration, booking_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, email, phone, event_type, other_event_type, check_in, check_out, time_in, time_out, number_of_guests, days_duration, 'Pending']
        );
        connection.release();

        res.status(201).json({
            id: result.insertId,
            message: 'Booking created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// UPDATE booking
app.put('/api/bookings/:id', async (req, res) => {
    try {
        const { booking_status, notes } = req.body;
        const connection = await pool.getConnection();
        
        await connection.query(
            'UPDATE bookings SET booking_status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [booking_status, notes, req.params.id]
        );
        connection.release();

        res.json({ message: 'Booking updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE booking
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
        connection.release();
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// ========== INQUIRY ENDPOINTS ==========

// GET all inquiries
app.get('/api/inquiries', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM inquiries ORDER BY created_at DESC');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// CREATE new inquiry
app.post('/api/inquiries', async (req, res) => {
    try {
        const { name, email, phone, inquiry_type, message } = req.body;

        if (!name || !email || !phone || !inquiry_type || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            `INSERT INTO inquiries (name, email, phone, inquiry_type, message, status)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, phone, inquiry_type, message, 'Unread']
        );
        connection.release();

        res.status(201).json({
            id: result.insertId,
            message: 'Inquiry submitted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// UPDATE inquiry status
app.put('/api/inquiries/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const connection = await pool.getConnection();
        
        await connection.query(
            'UPDATE inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, req.params.id]
        );
        connection.release();

        res.json({ message: 'Inquiry updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// ========== ANALYTICS ENDPOINTS ==========

// Get booking statistics
app.get('/api/stats', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        const [stats] = await connection.query(`
            SELECT 
                COUNT(*) as total_bookings,
                SUM(CASE WHEN booking_status = 'Confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
                SUM(CASE WHEN booking_status = 'Pending' THEN 1 ELSE 0 END) as pending_bookings,
                SUM(number_of_guests) as total_guests,
                AVG(number_of_guests) as avg_guests_per_booking
            FROM bookings
        `);
        
        connection.release();
        res.json(stats[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get booked dates (to show on calendar)
app.get('/api/booked-dates', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(`
            SELECT check_in, check_out, event_type, number_of_guests 
            FROM bookings 
            WHERE booking_status IN ('Confirmed', 'Pending')
            ORDER BY check_in ASC
        `);
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
