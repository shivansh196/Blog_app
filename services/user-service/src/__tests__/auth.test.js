const request = require('supertest');
const app = require('../index');
const db = require('../utils/db');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Setup test database
  });

  afterAll(async () => {
    await db.pool.end();
  });

  describe('POST /auth/register', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('POST /auth/login', () => {
    it('should authenticate user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });
}); 