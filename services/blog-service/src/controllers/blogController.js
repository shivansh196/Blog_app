const db = require('../utils/db');
const { validationResult } = require('express-validator');

const createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const userId = req.user.id;

    const result = await db.query(
      'INSERT INTO blog_service.posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error creating post' });
  }
};

const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await db.query(
      'SELECT * FROM blog_service.posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving posts' });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM blog_service.posts WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving post' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = await db.query(
      'SELECT * FROM blog_service.posts WHERE id = $1',
      [id]
    );

    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await db.query(
      'UPDATE blog_service.posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await db.query(
      'SELECT * FROM blog_service.posts WHERE id = $1',
      [id]
    );

    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await db.query('DELETE FROM blog_service.posts WHERE id = $1', [id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
};