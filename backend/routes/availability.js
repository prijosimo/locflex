// Express router to handle all routes related to availability
const express = require('express');
const router = express.Router();

// Importing the database connection pool
const pool = require('../config/db');

// Importing the auth middleware to protect routes
const authenticateToken = require('../middleware/auth');

// POST /api/availability: save a new availability entry for a user
router.post('/', async (req, res) => {
    const { user_id, date, status, notes } = req.body;

  // Basic validation (required fields)
    if (!user_id || !date || !status) {
        return res.status(400).json({ error: 'user_id, date and status are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO availability_entries (user_id, date, status, notes) VALUES ($1, $2, $3, $4) RETURNING *',
            [user_id, date, status, notes]
        );

        // Returning the newly created entry
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    });

// GET /api/availability/:userId — retrieve all availability entries for a certain user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
        'SELECT * FROM availability_entries WHERE user_id = $1 ORDER BY date ASC',
        [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    });

module.exports = router;