# Multi-Service Blog Platform

A microservices-based blog platform using Docker and AWS.

## Services

### User Service (Port 3002)
- User authentication and management
- JWT-based authentication
- Secure password hashing

Endpoints:
- POST /auth/register - Register new user
- POST /auth/login - User login
- GET /users/:id - Get user details
- PUT /users/:id - Update user
- DELETE /users/:id - Delete user

### Blog Service (Port 3003)
- Blog post management
- Pagination support

Endpoints:
- POST /blogs/ - Create blog post
- GET /blogs/ - List blog posts
- GET /blogs/:id - Get specific post
- PUT /blogs/:id - Update post
- DELETE /blogs/:id - Delete post

### Comment Service (Port 3004)
- Comment management
- Support for nested comments

Endpoints:
- POST /comments/ - Add comment
- GET /comments?post_id=:id - Get post comments
- DELETE /comments/:id - Delete comment

## Local Development

1. Clone the repository:
```bash
git clone [repository-url]
cd blog-platform

## Live Demo
API Base URL: http://13.61.101.92


