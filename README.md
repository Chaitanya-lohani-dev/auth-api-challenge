# Authentication API Challenge

A robust RESTful authentication API built with Node.js, Express, and MongoDB. This backend service implements secure user authentication with JWT access and refresh tokens, role-based access control (RBAC), and comprehensive security features.

## Features

- 🔐 **User Authentication** - Register, login, and logout functionality
- 🎫 **JWT Token Management** - Access tokens (15 min) and refresh tokens (7 days)
- 🔄 **Token Rotation** - Secure refresh token rotation with hashing
- 👥 **Role-Based Access Control** - Admin and user roles with protected routes
- ✅ **Input Validation** - Zod schema validation for requests
- 🔒 **Password Hashing** - Bcrypt for secure password storage
- 🍪 **Cookie Management** - HTTP-only cookies for refresh tokens
- 🛡️ **Security Best Practices** - Token hashing, CORS, and secure middleware

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: Bcryptjs
- **Validation**: Zod
- **Security**: CORS, Cookie-parser, Crypto

## Project Structure

```
auth-api-challenge/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── controllers/
│   └── authController.js        # Authentication logic (register, login, logout, refresh)
├── middleware/
│   ├── authMiddleware.js        # JWT verification middleware
│   └── adminMiddleware.js       # Admin role verification middleware
├── models/
│   └── user.js                  # User schema (name, email, password, role, refreshToken)
├── route/
│   ├── authRoutes.js            # Authentication endpoints
│   └── adminRoutes.js           # Admin-protected endpoints
├── utils/
│   ├── generateAccessToken.js   # Access token generation utility
│   ├── generateRefreshToken.js  # Refresh token generation utility
│   └── verifyRefreshToken.js    # Refresh token verification utility
├── server.js                    # Application entry point
└── package.json                 # Dependencies and scripts
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auth-api-challenge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/auth-api
   JWT_SECRET=your_jwt_secret_key_here
   REFRESH_TOKEN_SECREAT=your_refresh_token_secret_here
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

   The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
*Refresh token is set as an HTTP cookie*

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "_id": "user_id",
  "email": "john@example.com",
  "role": "user"
}
```

#### Refresh Access Token
```http
POST /api/auth/refresh-token
Cookie: refreshToken=<refresh_token>
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout
```http
POST /api/auth/logout
Cookie: refreshToken=<refresh_token>
```

**Response (200):**
```json
"User Loged Out succesfully"
```

### Admin Routes (`/api/admin`)

#### Access Admin Dashboard
```http
GET /api/admin/admin
Authorization: Bearer <admin_access_token>
```

**Response (200):**
```json
"Admin route accesed"
```

*Note: Only users with `role: "admin"` can access this route*

## Security Features

### Token Strategy
- **Access Tokens**: Short-lived (15 minutes), stored client-side
- **Refresh Tokens**: Long-lived (7 days), stored in HTTP-only cookies, hashed in database

### Token Rotation
When refreshing tokens:
1. Old refresh token is validated
2. New access and refresh tokens are generated
3. New refresh token replaces old one in database (hashed)
4. Old refresh token becomes invalid

### Password Security
- Passwords are hashed using bcrypt with salt rounds of 10
- Plain text passwords are never stored

### Middleware Protection
- `authMiddleware`: Validates JWT access tokens
- `adminMiddleware`: Validates tokens and checks admin role

## User Schema

```javascript
{
  name: String (required, min: 3 chars),
  email: String (required, unique, valid email),
  password: String (required, min: 6 chars, hashed),
  role: String (enum: ["admin", "user"], default: "user"),
  refreshToken: String (hashed SHA-256)
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `409` - Conflict (email already exists)
- `500` - Internal Server Error

## Validation Rules

### Registration
- Name: Minimum 3 characters
- Email: Valid email format
- Password: Minimum 6 characters
- Role: Must be "admin" or "user"

### Login
- Email: Valid email format
- Password: Minimum 6 characters

## Development

### Dependencies
```json
{
  "bcrypt": "^6.0.0",
  "bcryptjs": "^3.0.3",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "crypto": "^1.0.1",
  "dotenv": "^17.2.3",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "mongoose": "^9.0.1",
  "zod": "^4.1.13"
}
```

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Rate limiting
- [ ] Request logging
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Account lockout after failed attempts
- [ ] Two-factor authentication (2FA)

## License

This project is available for educational purposes.

## Author

Chaitanya Lohani
