require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const blogRoutes = require('./routes/blog');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes - Note: no prefix as routes already include /blogs
app.use('/', blogRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    service: 'blog-service',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Blog service running on port ${PORT}`);
});