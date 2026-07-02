// Express router to handles all routes related to capacity settings
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/capacity to save or update a user's word-count capacity
router.post('/', async (req, res) => {
    const { user_id, daily_word_count, weekly_word_count } = req.body;

  // All three fields are required
    if (!user_id || daily_word_count === undefined || weekly_word_count === undefined) {
        return res.status(400).json({ error: 'user_id, daily_word_count and weekly_word_count are required' });
    }

    try {
        // If a setting already exists for this user, update it — otherwise insert a new one
        const result = await pool.query(
            `INSERT INTO capacity_settings (user_id, daily_word_count, weekly_word_count)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id) DO UPDATE
            SET daily_word_count = $2, weekly_word_count = $3, updated_at = CURRENT_TIMESTAMP
            RETURNING *`,
            [user_id, daily_word_count, weekly_word_count]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/capacity/:userId — retrieve capacity settings for a specific user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM capacity_settings WHERE user_id = $1',
            [userId]
        );
        res.json(result.rows[0] || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;