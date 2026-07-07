// Express router that handles all routes related to task assignments
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/assignments that assign a new task to a user
    router.post('/', async (req, res) => {
        const { user_id, task_name, word_count, estimated_hours, due_date } = req.body;

    // user_id, task_name and word_count required
    if (!user_id || !task_name || word_count === undefined) {
        return res.status(400).json({ error: 'user_id, task_name and word_count are required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO assignments (user_id, task_name, word_count, estimated_hours, due_date)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user_id, task_name, word_count, estimated_hours || 0, due_date || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/assignments/:userId that get all assignments for a specific user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM assignments WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/assignments/:userId/workload — get total word count assigned to a user
router.get('/:userId/workload', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            `SELECT 
                SUM(word_count) AS total_words,
                COUNT(*) AS total_tasks
            FROM assignments 
            WHERE user_id = $1 AND status != 'completed'`,
            [userId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;