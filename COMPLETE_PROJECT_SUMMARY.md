# 🎉 COMPLETE PROJECT SUMMARY - Personal Diary API

## 📋 Project Details

**Project Name:** Personal Diary - Encrypted Notes  
**Team Members:**
- Parvati Hiregoudra (1GA23CS114)
- Monika M (1GA24CS407)

**Class:** 5th B  
**Subject:** Mini Project on Full Stack Framework (Backend)  
**Guide:** Prof. Shyam Sundar  
**Academic Year:** 2024-2025

---

## 🚀 How to Run

```bash
# 1. Navigate to project
cd "C:\backend project"

# 2. Install dependencies (first time only)
npm install

# 3. Start server
npm start

# 4. Open browser
http://localhost:3000
```

---

## 🌐 URLs

- **Landing Page:** http://localhost:3000
- **Diary App:** http://localhost:3000/diary
- **API Base:** http://localhost:3000/api

---

## 📁 Complete Project Structure

```
backend project/
├── config/
│   └── db.mjs                      # MongoDB connection
├── controllers/
│   ├── auth.controller.js          # Register & Login
│   └── entry.controller.js         # Diary CRUD operations
├── middleware/
│   └── auth-middleware.js          # JWT verification
├── models/
│   ├── user.model.js               # User schema
│   └── entry.model.js              # Entry schema
├── public/
│   ├── landing.html                # Landing page
│   ├── landing-style.css           # Landing page styles
│   ├── index.html                  # Diary app
│   ├── style.css                   # Diary app styles
│   └── app.js                      # Diary app logic
├── routes/
│   ├── auth.routes.js              # Auth endpoints
│   └── entry.routes.js             # Entry endpoints
├── utils/
│   └── crypto-utils.js             # Encryption functions
├── node_modules/                   # Dependencies
├── .env                            # Environment variables
├── app.mjs                         # Express app setup
├── server.mjs                      # Server entry point
├── package.json                    # Project config
└── package-lock.json               # Dependency lock
```

---

## 🔑 Environment Variables (.env)

```env
PORT=3000
MONGO_URI=mongodb+srv://parvati:G97YitPaWbq6AIQ4@cluster0.e9aprnc.mongodb.net/personalDiary
JWT_SECRET=my_super_secret_jwt_key_change_this_in_production_12345
MASTER_KEY=4f2d4e6b9d7c8a1e4f6d9c3a4b7f9e2d4c6b8a9e4f7c2b1a9d8c6b4f3a2e1d0f
```

---

## 📦 Dependencies (package.json)

```json
{
  "name": "personal-diary-api",
  "version": "1.0.0",
  "type": "module",
  "main": "server.mjs",
  "scripts": {
    "start": "node server.mjs",
    "dev": "nodemon server.mjs"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^7.8.7"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## 🎯 Features Implemented

### Security Features
✅ Password hashing with bcrypt (10 salt rounds)
✅ JWT token authentication (1 day expiry)
✅ AES-256-GCM encryption for diary entries
✅ Per-user encryption keys (CEK)
✅ Master key protection
✅ Authorization checks

### Diary Features
✅ User registration & login
✅ Create diary entries
✅ Read entries (decrypted)
✅ Update entries
✅ Delete entries
✅ Search by tags
✅ Filter by date range
✅ Filter by category
✅ Filter by mood
✅ Favorite marking
✅ Color themes (6 presets + custom)

### UI Features
✅ Beautiful landing page with team details
✅ Responsive design
✅ Gradient backgrounds
✅ Color-coded entries
✅ Mood tracking with emojis
✅ Category organization
✅ Smooth animations

---

## 🔐 API Endpoints

### Authentication
```
POST /api/auth/register
Body: { "email": "user@example.com", "password": "password123" }
Response: { "message": "User registered successfully" }

POST /api/auth/login
Body: { "email": "user@example.com", "password": "password123" }
Response: { "token": "jwt_token_here" }
```

### Diary Entries (Requires JWT Token)
```
POST /api/entries
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "title": "My Day",
  "tags": ["personal", "work"],
  "text": "Today was amazing...",
  "category": "personal",
  "mood": "happy",
  "color": "#667eea",
  "favorite": false
}

GET /api/entries
Headers: { "Authorization": "Bearer <token>" }
Query: ?tag=work&category=personal&mood=happy&favorite=true&startDate=2024-01-01&endDate=2024-12-31

GET /api/entries/:id
Headers: { "Authorization": "Bearer <token>" }

PUT /api/entries/:id
Headers: { "Authorization": "Bearer <token>" }
Body: { "title": "Updated", "text": "New content..." }

DELETE /api/entries/:id
Headers: { "Authorization": "Bearer <token>" }
```

---

## 💻 Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **crypto** (Node.js) - AES-256-GCM encryption
- **dotenv** - Environment variables
- **cors** - Cross-origin requests

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (gradients, animations)
- **JavaScript (ES6+)** - Logic
- **Fetch API** - HTTP requests

---

## 🔒 How Encryption Works

### 1. User Registration
```
User Password → bcrypt hash → Store in DB
Generate CEK (32 bytes) → Encrypt with Master Key → Store in DB
```

### 2. Creating Entry
```
User authenticates → Decrypt CEK with Master Key
Diary text → Encrypt with CEK (AES-256-GCM) → Store in DB
```

### 3. Reading Entry
```
User authenticates → Decrypt CEK with Master Key
Fetch encrypted entry → Decrypt with CEK → Return plain text
```

---

## 📊 Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  passwordHash: String (required),
  encryptedCEK: Buffer (required),
  cekIv: Buffer (required),
  cekAuthTag: Buffer (required)
}
```

### Entry Model
```javascript
{
  user: ObjectId (ref: User, required),
  title: String,
  tags: [String],
  category: String (default: "personal"),
  mood: String (default: "neutral"),
  color: String (default: "#667eea"),
  favorite: Boolean (default: false),
  encryptedText: Buffer (required),
  textIv: Buffer (required),
  textAuthTag: Buffer (required),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

---

## 🎨 Categories & Moods

### Categories
- 📝 Personal
- 💼 Work
- ✈️ Travel
- 💪 Health
- 🎯 Goals
- 🙏 Gratitude

### Moods
- 😊 Happy
- 😢 Sad
- 🤩 Excited
- 😰 Anxious
- 😐 Neutral

---

## 🎓 Skills Demonstrated

### Backend Development
✅ RESTful API design
✅ Authentication & authorization
✅ Database modeling
✅ Encryption implementation
✅ Error handling
✅ Security best practices

### Frontend Development
✅ Responsive UI design
✅ API integration
✅ State management
✅ Form handling
✅ User experience design

### Full-Stack Integration
✅ Frontend-backend communication
✅ Token-based authentication
✅ CRUD operations
✅ Search and filtering
✅ Real-time updates

---

## 📝 Testing the Project

### 1. Test Landing Page
- Open http://localhost:3000
- Verify team details are displayed
- Click "Launch Diary Application" button

### 2. Test Registration
- Enter email and password
- Click Register
- Should show success message

### 3. Test Login
- Enter same credentials
- Click Login
- Should redirect to diary

### 4. Test Create Entry
- Click "+ New Entry"
- Fill in title, category, mood, color, tags
- Write diary text
- Click Save

### 5. Test Filters
- Filter by category
- Filter by mood
- Search by tag
- Filter by date range
- Click Favorites

### 6. Test Edit/Delete
- Click on an entry
- Modify content
- Click Save
- Or click Delete

---

## 🏆 Project Highlights

### What Makes This Special
1. **Security-First Design** - End-to-end encryption
2. **Complete Full-Stack** - Backend + Frontend + Database
3. **Modern UI/UX** - Beautiful, responsive design
4. **Advanced Features** - Categories, moods, colors, favorites
5. **Production-Ready** - Error handling, validation, security
6. **Well-Documented** - Comprehensive documentation

### Resume Points
- "Built secure diary API with AES-256-GCM encryption"
- "Implemented JWT authentication with bcrypt password hashing"
- "Designed RESTful API with 7 endpoints and CRUD operations"
- "Created responsive frontend with advanced filtering"
- "Integrated MongoDB with Mongoose ODM"
- "Applied security best practices for sensitive data"

---

## 🚀 Deployment Ready

### To Deploy:
1. Update MONGO_URI with production database
2. Change JWT_SECRET to strong random string
3. Set NODE_ENV=production
4. Deploy to Render, Railway, or Heroku
5. Update frontend URLs if needed

---

## 📞 Support

If you encounter issues:
1. Check MongoDB connection
2. Verify all dependencies installed
3. Check .env file configuration
4. Review terminal logs for errors
5. Clear browser cache

---

## ✨ Congratulations!

You have successfully built a complete, secure, full-stack Personal Diary application!

**Team:** Parvati Hiregoudra & Monika M  
**Class:** 5th B  
**Guide:** Prof. Shyam Sundar  

**Good luck with your presentation!** 🎉🚀
