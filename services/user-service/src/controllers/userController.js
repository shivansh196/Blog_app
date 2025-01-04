const db = require('../utils/db');
const { hashPassword } = require('../utils/password');
const { validationResult } = require('express-validator');

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'SELECT id, username, email, created_at FROM user_service.users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Error retrieving user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await db.query(
      'SELECT * FROM user_service.users WHERE id = $1',
      [id]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is authorized to update
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }

    let query = 'UPDATE user_service.users SET ';
    const values = [];
    let valueCount = 1;

    if (username) {
      query += `username = $${valueCount}, `;
      values.push(username);
      valueCount++;
    }

    if (email) {
      query += `email = $${valueCount}, `;
      values.push(email);
      valueCount++;
    }

    if (password) {
      const hashedPassword = await hashPassword(password);
      query += `password_hash = $${valueCount}, `;
      values.push(hashedPassword);
      valueCount++;
    }

    query += 'updated_at = CURRENT_TIMESTAMP ';
    query += `WHERE id = $${valueCount} RETURNING id, username, email, created_at, updated_at`;
    values.push(id);

    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const userExists = await db.query(
      'SELECT * FROM user_service.users WHERE id = $1',
      [id]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is authorized to delete
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Not authorized to delete this user' });
    }

    await db.query('DELETE FROM user_service.users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser
};