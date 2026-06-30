// Importing the Express framework for building the API
const express = require('express');

// CORS is what lets the frontend (that runs on a different port) call this backend without the browser blocking the request
const cors = require('cors');

// Loading config/secrets from a .env file into process.env to keep secretrs out of the code
require('dotenv').config();

// Creating the Express application instance (the actual server object)
const app = express();

// Applying CORS to every incoming request
app.use(cors());

// Allowing Express to  parse incoming JSON request bodies automatically
app.use(express.json());

// Just a health check to confirm the server is running before adding real features
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'LocFlex backend is running' });
});

// Use the port from .env if set. If not,  default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});