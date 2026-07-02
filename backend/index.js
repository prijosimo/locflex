// Importing the Express framework for building the API
const express = require('express');

// CORS is what lets the frontend (that runs on a different port) call this backend without the browser blocking the request
const cors = require('cors');

// Loading config/secrets from a .env file into process.env to keep secretrs out of the code
require('dotenv').config();

// Importing the database connection pool
const pool = require('./config/db');

// Importing the availability routes
const availabilityRoutes = require('./routes/availability');

// Importing the capacity routes
const capacityRoutes = require('./routes/capacity');

// Creating the Express application instance (the actual server object)
const app = express();

// Applying CORS to every incoming request
app.use(cors());

// Allowing Express to  parse incoming JSON request bodies automatically
app.use(express.json());

// Mounting the availability routes under the /api/availability path
app.use('/api/availability', availabilityRoutes);

// Mount capacity routes at /api/capacity
app.use('/api/capacity', capacityRoutes);

// Just a health check to confirm the server is running before adding real features
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'LocFlex backend is running' });
});

// Database health check — confirms the backend can successfully reach PostgreSQL
app.get('/api/db-health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: 'ok', time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Use the port from .env if set. If not,  default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});