const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  schema: 'user_service',
  // Add these connection settings
  connectionTimeoutMillis: 5000,
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

console.log('Database Config:', {
  host: dbConfig.host,
  database: dbConfig.database,
  port: dbConfig.port,
  user: dbConfig.user
});

const pool = new Pool(dbConfig);

// Test database connection with better error handling
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected successfully at:', result.rows[0].now);
  } catch (err) {
    console.error('Database connection error:', {
      code: err.code,
      message: err.message,
      detail: err.detail,
      host: dbConfig.host,
      database: dbConfig.database,
      user: dbConfig.user,
      port: dbConfig.port
    });
    // Don't exit process in development
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

testConnection();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};