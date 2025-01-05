const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createComment,
  getComments,
  deleteComment
} = require('../controllers/commentController');

const router = express.Router();

// Validation middleware
const commentValidation = [
  body('post_id').isInt(),
  body('content').trim().notEmpty(),
  body('parent_id').optional().isInt()
];

// Routes exactly as specified in requirements
router.post('/comments', authenticateToken, commentValidation, createComment);
router.get('/comments', getComments);
router.delete('/comments/:id', authenticateToken, deleteComment);

module.exports = router;