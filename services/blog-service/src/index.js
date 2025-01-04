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

// Routes
app.use('/blogs', blogRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Blog service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});