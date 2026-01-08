# Authentication API

This API provides authentication endpoints for email/password signup/signin and Google OAuth login.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create `.env` file):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hackday2026?schema=public
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
PORT=3001
```

3. Generate Prisma client:
```bash
cd packages/db
npm run db:generate
```

4. Run database migrations:
```bash
cd packages/db
npm run db:push
# or
npm run db:migrate
```

## API Endpoints

### POST `/api/auth/signup`
Create a new user account with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST `/api/auth/signin`
Sign in with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Sign in successful",
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "name": "John Doe",
    "image": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET `/api/auth/google`
Initiate Google OAuth authentication. This will redirect to Google's consent screen.

### GET `/api/auth/google/callback`
Google OAuth callback endpoint. After successful authentication, returns user data and JWT token.

**Response:**
```json
{
  "message": "Google sign in successful",
  "user": {
    "id": "clx...",
    "email": "user@gmail.com",
    "name": "John Doe",
    "image": "https://...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Authentication Middleware

Use the `authenticateToken` middleware to protect routes:

```typescript
import { authenticateToken, AuthRequest } from "./middleware/auth";

router.get("/protected", authenticateToken, (req: AuthRequest, res) => {
  // req.userId and req.userEmail are available
  res.json({ userId: req.userId, email: req.userEmail });
});
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure consent screen
6. Create OAuth 2.0 Client ID (Web application)
7. Add authorized redirect URIs: `http://localhost:3001/api/auth/google/callback`
8. Copy Client ID and Client Secret to your `.env` file

## Database Schema

The User model includes:
- `id`: Unique identifier (CUID)
- `email`: Unique email address
- `password`: Hashed password (nullable for OAuth users)
- `name`: User's display name
- `image`: Profile image URL
- `googleId`: Google OAuth ID (nullable, unique)
- `emailVerified`: Email verification timestamp
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp
