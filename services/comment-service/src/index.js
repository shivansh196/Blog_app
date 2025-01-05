require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const commentRoutes = require('./routes/comment');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes - Note: no prefix as routes already include /comments
app.use('/', commentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    service: 'comment-service',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Comment service running on port ${PORT}`);
});