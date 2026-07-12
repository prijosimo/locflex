const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/register to create a new user account
router.post('/register', async (req, res) => {
    const { name, email, password, timezone } = req.body;

    // Validation that the required fields are there    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    try {
        // Hash the password using bcrypt before storing it (never store plain text passwords)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserting the new user into the database by storing the hashed password
        const result = await pool.query(
            'INSERT INTO users (name, email, password, timezone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, timezone',
            [name, email, hashedPassword, timezone || 'UTC']
        );

        // Returning a success message and the new user's data
        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (err) {
        // This part handles duplicate email error
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Email already registered' });
        }
    res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/login to log in and receive a JWT token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validation that the required fields are there
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Finding the user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        // If no user is found, return a generic error
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Comparing the provided password against the stored hash
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Creating a JWT token with  the user's ID
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Returning the token and basic user's info
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;