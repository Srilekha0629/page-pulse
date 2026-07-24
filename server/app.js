const express = require('express');
const cors = require('cors');
const auditRoutes = require('./routes/auditRoutes');

const app = express();

// Normalize CLIENT_URL to prevent trailing slash matching issues
const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const normalizedClientUrl = rawClientUrl.replace(/\/$/, '');
const allowedOrigins = Array.from(new Set([
  normalizedClientUrl,
  `${normalizedClientUrl}/`,
  'http://localhost:5173',
  'http://localhost:5173/',
  'http://127.0.0.1:5173'
]));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin calls)
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true
}));

app.use(express.json());

// Health Check Endpoints
app.get('/', (req, res) => {
  res.json({ message: 'Page Pulse API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', auditRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

module.exports = app;