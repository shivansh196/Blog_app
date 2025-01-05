const db = require('../utils/db');
const { validationResult } = require('express-validator');

// Create a new comment
const createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { post_id, content, parent_id } = req.body;
    const userId = req.user.id;

    const result = await db.query(
      'INSERT INTO comment_service.comments (post_id, user_id, content, parent_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [post_id, userId, content, parent_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creating comment' });
  }
};

// Get comments for a post
const getComments = async (req, res) => {
  try {
    const { post_id } = req.query;
    
    if (!post_id) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    const result = await db.query(
      'SELECT * FROM comment_service.comments WHERE post_id = $1 ORDER BY created_at DESC',
      [post_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving comments' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await db.query(
      'SELECT * FROM comment_service.comments WHERE id = $1',
      [id]
    );

    if (comment.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await db.query('DELETE FROM comment_service.comments WHERE id = $1', [id]);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
};

module.exports = {
  createComment,
  getComments,
  deleteComment
};