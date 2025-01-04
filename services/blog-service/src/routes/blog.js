const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost
} = require('../controllers/blogController');

const router = express.Router();

// Validation middleware
const postValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published')
];

// Routes
router.post('/', authenticateToken, postValidation, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPost);
router.put('/:id', authenticateToken, postValidation, updatePost);
router.delete('/:id', authenticateToken, deletePost);

module.exports = router;