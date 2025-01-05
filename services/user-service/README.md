# User Service

Handles user authentication and management for the blog platform.

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### User Management
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile
- `DELETE /users/:id` - Delete user

## Development

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Run tests
npm test
```

## Environment Variables

See `.env.example` for required environment variables. 