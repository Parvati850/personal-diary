# 🔍 How It Works - Personal Diary API

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
│                    (Web Browser)                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (public/)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  index.html  │  style.css  │  app.js                 │  │
│  │  - Login UI  │  - Styling  │  - API calls            │  │
│  │  - Diary UI  │  - Layout   │  - State management     │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ API Calls (/api/*)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    server.mjs                         │  │
│  │              (Entry Point + DB Connection)            │  │
│  └────────────────────────┬─────────────────────────────┘  │
│                            │                                 │
│  ┌────────────────────────▼─────────────────────────────┐  │
│  │                      app.mjs                          │  │
│  │              (Express App + Routes)                   │  │
│  └────────────────────────┬─────────────────────────────┘  │
│                            │                                 │
│         ┌──────────────────┴──────────────────┐             │
│         │                                      │             │
│  ┌──────▼──────┐                      ┌───────▼────────┐   │
│  │ Auth Routes │                      │ Entry Routes   │   │
│  │ /api/auth/* │                      │ /api/entries/* │   │
│  └──────┬──────┘                      └───────┬────────┘   │
│         │                                      │             │
│  ┌──────▼──────────┐              ┌───────────▼─────────┐  │
│  │ Auth Controller │              │ Entry Controller    │  │
│  │ - register()    │              │ - createEntry()     │  │
│  │ - login()       │              │ - getEntry()        │  │
│  └──────┬──────────┘              │ - listEntries()     │  │
│         │                          │ - updateEntry()     │  │
│         │                          │ - deleteEntry()     │  │
│         │                          └───────┬─────────────┘  │
│         │                                  │                 │
│         │         ┌────────────────────────┘                │
│         │         │                                          │
│  ┌──────▼─────────▼──────┐      ┌─────────────────────┐   │
│  │   Auth Middleware     │      │   Crypto Utils      │   │
│  │   - Verify JWT        │      │   - encryptText()   │   │
│  │   - Decrypt User Key  │      │   - decryptText()   │   │
│  └──────┬────────────────┘      │   - encryptCEK()    │   │
│         │                        │   - decryptCEK()    │   │
│         │                        └─────────────────────┘   │
│         │                                                    │
│  ┌──────▼────────────────────────────────────────────┐    │
│  │                    Models                          │    │
│  │  ┌──────────────┐         ┌──────────────────┐   │    │
│  │  │ User Model   │         │  Entry Model     │   │    │
│  │  │ - email      │         │  - user          │   │    │
│  │  │ - password   │         │  - title         │   │    │
│  │  │ - CEK        │         │  - tags          │   │    │
│  │  └──────────────┘         │  - encrypted     │   │    │
│  │                            │  - iv, authTag   │   │    │
│  │                            └──────────────────┘   │    │
│  └───────────────────────────────┬────────────────────┘   │
└──────────────────────────────────┼────────────────────────┘
                                   │
                                   │ Mongoose
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Collections:                                         │  │
│  │  - users (hashed passwords + encrypted keys)         │  │
│  │  - entries (encrypted diary content)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Flow

### 1. User Registration
```
User enters email + password
         │
         ▼
Password hashed with bcrypt (10 rounds)
         │
         ▼
Generate random CEK (Content Encryption Key)
         │
         ▼
Encrypt CEK with Master Key (AES-256-GCM)
         │
         ▼
Store in database:
  - email
  - passwordHash
  - encryptedCEK
  - cekIv
  - cekAuthTag
```

### 2. User Login
```
User enters email + password
         │
         ▼
Find user by email
         │
         ▼
Compare password with bcrypt
         │
         ▼
Generate JWT token (contains userId)
         │
         ▼
Return token to frontend
         │
         ▼
Frontend stores token in localStorage
```

### 3. Creating Diary Entry
```
User writes diary entry
         │
         ▼
Frontend sends: title, tags, text + JWT token
         │
         ▼
Backend verifies JWT token
         │
         ▼
Decrypt user's CEK using Master Key
         │
         ▼
Encrypt diary text with user's CEK (AES-256-GCM)
         │
         ▼
Store in database:
  - userId
  - title (plain)
  - tags (plain)
  - encryptedText
  - textIv
  - textAuthTag
  - createdAt
```

### 4. Reading Diary Entry
```
User clicks on entry
         │
         ▼
Frontend sends: entryId + JWT token
         │
         ▼
Backend verifies JWT token
         │
         ▼
Decrypt user's CEK using Master Key
         │
         ▼
Fetch encrypted entry from database
         │
         ▼
Decrypt entry text with user's CEK
         │
         ▼
Return plain text to frontend
         │
         ▼
User sees their diary entry
```

---

## 🔑 Encryption Layers

### Layer 1: Password Protection
- **Algorithm:** bcrypt
- **Purpose:** Protect user passwords
- **Storage:** Hashed password in database
- **Security:** Cannot be reversed

### Layer 2: Content Encryption Key (CEK)
- **Algorithm:** AES-256-GCM
- **Purpose:** Unique key per user for encrypting diary entries
- **Storage:** Encrypted with Master Key
- **Security:** Only accessible when user is authenticated

### Layer 3: Master Key
- **Algorithm:** AES-256-GCM
- **Purpose:** Encrypt all user CEKs
- **Storage:** Environment variable (.env)
- **Security:** Never sent to client, never in database

### Layer 4: Diary Entry Encryption
- **Algorithm:** AES-256-GCM
- **Purpose:** Encrypt actual diary content
- **Storage:** Encrypted text + IV + Auth Tag in database
- **Security:** Only decryptable with user's CEK

---

## 📊 Data Flow Examples

### Example 1: Register New User

**Request:**
```json
POST /api/auth/register
{
  "email": "alice@example.com",
  "password": "mypassword123"
}
```

**What Happens:**
1. Password "mypassword123" → bcrypt → `$2a$10$abc...xyz` (hash)
2. Generate random CEK: `a1b2c3d4...` (32 bytes)
3. Encrypt CEK with Master Key → `encrypted_cek + iv + authTag`
4. Save to database:
```json
{
  "email": "alice@example.com",
  "passwordHash": "$2a$10$abc...xyz",
  "encryptedCEK": <Buffer>,
  "cekIv": <Buffer>,
  "cekAuthTag": <Buffer>
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

---

### Example 2: Create Diary Entry

**Request:**
```json
POST /api/entries
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "title": "My Amazing Day",
  "tags": ["personal", "happy"],
  "text": "Today was incredible! I learned so much..."
}
```

**What Happens:**
1. Verify JWT token → Extract userId
2. Fetch user from database
3. Decrypt user's CEK using Master Key
4. Encrypt diary text with CEK:
   - Plain: "Today was incredible!..."
   - Encrypted: `<Buffer 8a 3f 2c ...>`
5. Save to database:
```json
{
  "user": "507f1f77bcf86cd799439011",
  "title": "My Amazing Day",
  "tags": ["personal", "happy"],
  "encryptedText": <Buffer>,
  "textIv": <Buffer>,
  "textAuthTag": <Buffer>,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "title": "My Amazing Day",
  "tags": ["personal", "happy"]
}
```

---

### Example 3: Read Diary Entry

**Request:**
```json
GET /api/entries/507f1f77bcf86cd799439012
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**What Happens:**
1. Verify JWT token → Extract userId
2. Fetch entry from database (encrypted)
3. Verify entry belongs to user
4. Decrypt user's CEK using Master Key
5. Decrypt entry text with CEK:
   - Encrypted: `<Buffer 8a 3f 2c ...>`
   - Plain: "Today was incredible!..."

**Response:**
```json
{
  "title": "My Amazing Day",
  "tags": ["personal", "happy"],
  "text": "Today was incredible! I learned so much..."
}
```

---

## 🎯 Key Features Explained

### 1. JWT Authentication
- **What:** JSON Web Token for stateless authentication
- **How:** Token contains userId, signed with JWT_SECRET
- **Why:** No need to store sessions, scalable

### 2. Per-User Encryption
- **What:** Each user has unique encryption key (CEK)
- **How:** CEK generated on registration, encrypted with Master Key
- **Why:** If one key is compromised, only that user's data is at risk

### 3. AES-256-GCM
- **What:** Advanced Encryption Standard with Galois/Counter Mode
- **How:** Symmetric encryption with authentication
- **Why:** Industry standard, fast, secure, authenticated

### 4. Search Without Decryption
- **What:** Search by tags and dates without decrypting content
- **How:** Title and tags stored in plain text, content encrypted
- **Why:** Performance + functionality + security balance

---

## 🔒 Security Guarantees

✅ **Passwords never stored in plain text** (bcrypt hashing)
✅ **Diary content always encrypted** (AES-256-GCM)
✅ **Each user has unique encryption key** (CEK per user)
✅ **Master key never exposed** (environment variable only)
✅ **Authentication required for all operations** (JWT middleware)
✅ **Users can only access their own entries** (authorization checks)
✅ **Encryption authenticated** (GCM mode prevents tampering)

---

## 📈 Performance Considerations

### Fast Operations:
- ✅ Login (bcrypt comparison)
- ✅ List entries (no decryption needed)
- ✅ Search by tags (plain text search)
- ✅ Filter by date (indexed field)

### Slower Operations:
- ⚠️ Reading entry (requires decryption)
- ⚠️ Creating entry (requires encryption)
- ⚠️ Updating entry (requires re-encryption)

**Note:** Encryption/decryption is still very fast (milliseconds) for typical diary entries.

---

## 🎓 What You Learn From This Project

1. **Backend Development**
   - Express.js server setup
   - RESTful API design
   - Middleware implementation
   - Error handling

2. **Database**
   - MongoDB/Mongoose
   - Schema design
   - Queries and filters
   - Indexing

3. **Security**
   - Password hashing (bcrypt)
   - JWT authentication
   - Encryption (AES-256-GCM)
   - Authorization

4. **Frontend**
   - Vanilla JavaScript
   - API integration
   - State management
   - Responsive design

5. **Full-Stack Integration**
   - Frontend-backend communication
   - Token-based auth flow
   - Error handling
   - User experience

---

## 🚀 This Makes You Stand Out

**Why this project is impressive:**

1. **Security-First Design** - Shows you understand encryption
2. **Complete Full-Stack** - Backend + Frontend + Database
3. **Production-Ready Code** - Proper structure, error handling
4. **Modern Tech Stack** - Latest Node.js, ES6+, MongoDB
5. **Real-World Application** - Solves actual problem
6. **Scalable Architecture** - Can handle many users

**Perfect for:**
- Resume/Portfolio
- Job interviews
- Learning full-stack development
- Understanding security concepts

---

*Now you understand how everything works together!* 🎉
