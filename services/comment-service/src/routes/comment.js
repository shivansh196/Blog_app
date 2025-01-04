const express = require('express');
const { body, query } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createComment,
  getComments,
  deleteComment
} = require('../controllers/commentController');

const router = express.Router();

// Validation middleware
const commentValidation = [
  body('post_id')
    .isInt()
    .withMessage('Post ID must be an integer'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 1000 })
    .withMessage('Comment must not exceed 1000 characters'),
  body('parent_id')
    .optional()
    .isInt()
    .withMessage('Parent ID must be an integer')
];

// Routes
router.post('/', authenticateToken, commentValidation, createComment);
router.get('/', getComments);
router.delete('/:id', authenticateToken, deleteComment);

module.exports = router;