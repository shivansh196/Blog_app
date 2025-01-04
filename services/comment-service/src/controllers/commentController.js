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
    const user_id = req.user.id;

    // Verify if post exists
    const postExists = await db.query(
      'SELECT id FROM blog_service.posts WHERE id = $1',
      [post_id]
    );

    if (postExists.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // If parent_id is provided, verify if it exists
    if (parent_id) {
      const parentExists = await db.query(
        'SELECT id FROM comment_service.comments WHERE id = $1',
        [parent_id]
      );

      if (parentExists.rows.length === 0) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
    }

    const result = await db.query(
      'INSERT INTO comment_service.comments (post_id, user_id, content, parent_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [post_id, user_id, content, parent_id]
    );

    // Get username for the response
    const userResult = await db.query(
      'SELECT username FROM user_service.users WHERE id = $1',
      [user_id]
    );

    const comment = {
      ...result.rows[0],
      username: userResult.rows[0].username
    };

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
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

    // Get all comments for the post with user information
    const result = await db.query(
      `SELECT c.*, u.username 
       FROM comment_service.comments c
       JOIN user_service.users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at DESC`,
      [post_id]
    );

    // Organize comments into a tree structure
    const commentTree = buildCommentTree(result.rows);

    res.json(commentTree);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ error: 'Error retrieving comments' });
  }
};

// Helper function to build comment tree
const buildCommentTree = (comments) => {
  const commentMap = {};
  const roots = [];

  // First pass: create a map of comments
  comments.forEach(comment => {
    commentMap[comment.id] = {
      ...comment,
      children: []
    };
  });

  // Second pass: build the tree
  comments.forEach(comment => {
    if (comment.parent_id) {
      const parent = commentMap[comment.parent_id];
      if (parent) {
        parent.children.push(commentMap[comment.id]);
      }
    } else {
      roots.push(commentMap[comment.id]);
    }
  });

  return roots;
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if comment exists and belongs to user
    const commentCheck = await db.query(
      'SELECT * FROM comment_service.comments WHERE id = $1',
      [id]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (commentCheck.rows[0].user_id !== user_id) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await db.query(
      'DELETE FROM comment_service.comments WHERE id = $1',
      [id]
    );

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Error deleting comment' });
  }
};

module.exports = {
  createComment,
  getComments,
  deleteComment
};