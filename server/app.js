const express = require('express');
const cors = require('cors');
const auditRoutes = require('./routes/auditRoutes');

const app = express();

// Normalize CLIENT_URL to prevent trailing slash matching issues
app.use(cors({
  origin: [
    "https://page-pulse-lime-mu.vercel.app",
    "http://localhost:5173"
  ],
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