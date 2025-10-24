const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Configuration CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
}));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Nation Sounds API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Route pour tester la connexion DB
app.get('/api/test', async (req, res) => {
  try {
    const { Pool } = require('pg');
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" 
        ? { rejectUnauthorized: false }
        : false,
    });
    
    const result = await pool.query('SELECT NOW() as current_time');
    await pool.end();
    
    res.json({
      message: 'Database connection successful!',
      currentTime: result.rows[0].current_time,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });
  }
});

module.exports = app;