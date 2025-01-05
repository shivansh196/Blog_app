# API Documentation

Base URL: http://13.61.101.92
Alternative Domain: ec2-13-61-101-92.eu-north-1.compute.amazonaws.com

## User Service (Port 3002)

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### User Management

#### Get User Profile
```http
GET /users/:id
Authorization: Bearer <token>
```

#### Update User
```http
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Delete User
```http
DELETE /users/:id
Authorization: Bearer <token>
```

## Blog Service (Port 3003)

### Posts

#### Create Post
```http
POST /blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "content": "string"
}
```

#### List Posts
```http
GET /blogs?page=1&limit=10
```

#### Get Single Post
```http
GET /blogs/:id
```

#### Update Post
```http
PUT /blogs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "content": "string"
}
```

#### Delete Post
```http
DELETE /blogs/:id
Authorization: Bearer <token>
```

## Comment Service (Port 3004)

### Comments

#### Create Comment
```http
POST /comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "post_id": "number",
  "content": "string",
  "parent_id": "number" // Optional
}
```

#### List Comments
```http
GET /comments?post_id=1&parent_id=1
```

#### Delete Comment
```http
DELETE /comments/:id
Authorization: Bearer <token>
``` 