const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} = require('../controllers/blogController');

const router = express.Router();

// Validation middleware
const postValidation = [
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty()
];

// Routes exactly as specified in requirements
router.post('/blogs', authenticateToken, postValidation, createPost);
router.get('/blogs', getPosts);
router.get('/blogs/:id', getPostById);
router.put('/blogs/:id', authenticateToken, postValidation, updatePost);
router.delete('/blogs/:id', authenticateToken, deletePost);

module.exports = router;