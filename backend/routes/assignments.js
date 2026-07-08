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

// GET /api/assignments/:userId/overload to check if the user exceeds his or her capacity
router.get('/:userId/overload', async (req, res) => {
    const { userId } = req.params;

    try {
        // Get total assigned word count for incomplete tasks
        const workloadResult = await pool.query(
            `SELECT COALESCE(SUM(word_count), 0) AS total_words
            FROM assignments 
            WHERE user_id = $1 AND status != 'completed'`,
        [userId]
        );

    // Get the user's capacity settings
    const capacityResult = await pool.query(
        'SELECT daily_word_count, weekly_word_count FROM capacity_settings WHERE user_id = $1',
        [userId]
    );

    const totalWords = parseInt(workloadResult.rows[0].total_words);
    const capacity = capacityResult.rows[0];

    // If no capacity settings is found, a warning shoulçd be returned
    if (!capacity) {
        return res.json({ overloaded: false, message: 'No capacity settings found' });
    }

    const weeklyLimit = capacity.weekly_word_count;
    const overloaded = totalWords > weeklyLimit;

    res.json({
        overloaded,
        total_words: totalWords,
        weekly_limit: weeklyLimit,
        message: overloaded
            ? `Warning: assigned workload (${totalWords} words) exceeds weekly capacity (${weeklyLimit} words)`
            : `Workload is within capacity (${totalWords} / ${weeklyLimit} words)`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;