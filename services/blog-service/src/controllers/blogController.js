const db = require('../utils/db');
const { validationResult } = require('express-validator');

// Create a new blog post
const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const userId = req.user.id; // From JWT token

    const result = await db.query(
      'INSERT INTO blog_service.posts (user_id, title, content, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, title, content, 'published']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Error creating blog post' });
  }
};

// Get all blog posts with pagination
const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const countResult = await db.query('SELECT COUNT(*) FROM blog_service.posts');
    const totalPosts = parseInt(countResult.rows[0].count);

    const posts = await db.query(
      'SELECT p.*, u.username as author FROM blog_service.posts p JOIN user_service.users u ON p.user_id = u.id ORDER BY p.created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      posts: posts.rows,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    });
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ error: 'Error retrieving blog posts' });
  }
};

// Get a specific blog post
const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT p.*, u.username as author FROM blog_service.posts p JOIN user_service.users u ON p.user_id = u.id WHERE p.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).json({ error: 'Error retrieving blog post' });
  }
};

// Update a blog post
const updatePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content, status } = req.body;
    const userId = req.user.id;

    // Check if post exists and belongs to user
    const postCheck = await db.query(
      'SELECT * FROM blog_service.posts WHERE id = $1',
      [id]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (postCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const result = await db.query(
      'UPDATE blog_service.posts SET title = $1, content = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5 RETURNING *',
      [title, content, status, id, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Error updating blog post' });
  }
};

// Delete a blog post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if post exists and belongs to user
    const postCheck = await db.query(
      'SELECT * FROM blog_service.posts WHERE id = $1',
      [id]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (postCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await db.query(
      'DELETE FROM blog_service.posts WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Error deleting blog post' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost
};