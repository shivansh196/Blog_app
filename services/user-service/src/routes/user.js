const express = require('express');
const { body } = require('express-validator');
const { getUser, updateUser, deleteUser } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Update user validation middleware
const updateValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Routes
router.get('/:id', authenticateToken, getUser);
router.put('/:id', authenticateToken, updateValidation, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;