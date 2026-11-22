# 🔒 Personal Diary API - Encrypted Notes

A secure full-stack application where users can store private diary entries with end-to-end encryption.

## Features

### Security
- **User Authentication**: bcrypt password hashing + JWT tokens
- **End-to-End Encryption**: Each diary entry encrypted with AES-256-GCM
- **Per-User Encryption Keys**: Each user has unique encryption key (CEK)
- **Master Key Protection**: User keys encrypted with master key

### Functionality
- User registration and login
- Create, read, update, delete diary entries
- Search entries by tags
- Filter entries by date range
- Clean, responsive UI

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing
- crypto (Node.js) for AES-256-GCM encryption

**Frontend:**
- Vanilla JavaScript
- Modern CSS with gradients
- Responsive design

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create/update `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
MASTER_KEY=4f2d4e6b9d7c8a1e4f6d9c3a4b7f9e2d4c6b8a9e4f7c2b1a9d8c6b4f3a2e1d0f
```

**Important:** 
- Replace `MONGO_URI` with your MongoDB connection string
- Generate a secure `JWT_SECRET` (random string)
- `MASTER_KEY` must be 64 hex characters (32 bytes)

### 3. Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

### 4. Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  { "email": "user@example.com", "password": "password123" }
  ```

- `POST /api/auth/login` - Login user
  ```json
  { "email": "user@example.com", "password": "password123" }
  ```
  Returns: `{ "token": "jwt_token" }`

### Diary Entries (Requires JWT Token)
- `POST /api/entries` - Create new entry
  ```json
  {
    "title": "My Day",
    "tags": ["personal", "work"],
    "text": "Today was amazing..."
  }
  ```

- `GET /api/entries` - List all entries (with optional filters)
  - Query params: `?tag=work&startDate=2024-01-01&endDate=2024-12-31`

- `GET /api/entries/:id` - Get single entry (decrypted)

- `PUT /api/entries/:id` - Update entry
  ```json
  {
    "title": "Updated Title",
    "tags": ["updated"],
    "text": "Updated content..."
  }
  ```

- `DELETE /api/entries/:id` - Delete entry

## How Encryption Works

1. **User Registration:**
   - Password hashed with bcrypt
   - Unique Content Encryption Key (CEK) generated for user
   - CEK encrypted with master key and stored in database

2. **Creating Entry:**
   - User authenticates with JWT
   - CEK decrypted using master key
   - Diary text encrypted with user's CEK
   - Encrypted data stored in database

3. **Reading Entry:**
   - User authenticates with JWT
   - CEK decrypted using master key
   - Entry decrypted with user's CEK
   - Plain text returned to user

## Project Structure

```
personal-diary-api/
├── config/
│   └── db.mjs              # MongoDB connection
├── controllers/
│   ├── auth.controller.js  # Registration & login logic
│   └── entry.controller.js # CRUD operations for entries
├── middleware/
│   └── auth-middleware.js  # JWT verification
├── models/
│   ├── user.model.js       # User schema
│   └── entry.model.js      # Entry schema
├── routes/
│   ├── auth.routes.js      # Auth endpoints
│   └── entry.routes.js     # Entry endpoints
├── utils/
│   └── crypto-utils.js     # Encryption/decryption functions
├── public/                 # Frontend files
│   ├── index.html
│   ├── style.css
│   └── app.js
├── app.mjs                 # Express app setup
├── server.mjs              # Server entry point
├── .env                    # Environment variables
└── package.json
```

## Security Best Practices

✅ Passwords hashed with bcrypt (never stored plain)
✅ JWT tokens for stateless authentication
✅ AES-256-GCM encryption for diary entries
✅ Per-user encryption keys
✅ Master key stored securely (environment variable)
✅ CORS enabled for frontend integration

## Resume Highlights

This project demonstrates:
- **Full-stack development** (Node.js + MongoDB + Vanilla JS)
- **Security implementation** (encryption, hashing, JWT)
- **RESTful API design**
- **Database modeling** (MongoDB/Mongoose)
- **Authentication & authorization**
- **Modern frontend** (responsive, clean UI)

## Future Enhancements

- File attachments (encrypted)
- Rich text editor
- Export diary as PDF
- Two-factor authentication
- Password reset functionality
- Entry sharing with other users

## License

MIT
