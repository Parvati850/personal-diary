# 🚀 Quick Start Guide

## Step 1: Update MongoDB Connection

Edit `.env` file and replace with your MongoDB URI:
```env
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/diary
JWT_SECRET=my_super_secret_jwt_key_change_this_in_production
MASTER_KEY=4f2d4e6b9d7c8a1e4f6d9c3a4b7f9e2d4c6b8a9e4f7c2b1a9d8c6b4f3a2e1d0f
```

**Get Free MongoDB:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

## Step 2: Install Dependencies (if not done)
```bash
npm install
```

## Step 3: Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## Step 4: Open Your Browser
Navigate to:
```
http://localhost:5000
```

## Step 5: Test the Application

### Register & Login
1. Click **"Register"** tab
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. Click **Register** button
5. Switch to **"Login"** tab
6. Login with same credentials

### Create Your First Entry
1. Click **"+ New Entry"** button
2. Add a title: `My First Day`
3. Add tags: `personal, thoughts`
4. Write your diary entry
5. Click **"Save"**

### Try Search Features
1. Search by tag: Type `personal` in search box
2. Filter by date: Select date range
3. Click **"Search"**
4. Click **"Clear"** to reset

### Edit & Delete
1. Click on any entry in the sidebar
2. Modify the content
3. Click **"Save"** to update
4. Click **"Delete"** to remove (with confirmation)

## 🎯 Features to Showcase

✅ **Secure Authentication** - bcrypt + JWT  
✅ **End-to-End Encryption** - AES-256-GCM  
✅ **Full CRUD Operations** - Create, Read, Update, Delete  
✅ **Advanced Search** - By tags and date range  
✅ **Responsive UI** - Works on mobile and desktop  
✅ **Real-time Updates** - Instant feedback  

## 🔒 Security Highlights

- Passwords never stored in plain text
- Each entry encrypted before saving to database
- Unique encryption key per user
- JWT tokens for stateless authentication
- Protected API endpoints

## 📝 API Testing (Optional)

You can also test the API directly using tools like Postman or curl:

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Create Entry (replace YOUR_TOKEN)
```bash
curl -X POST http://localhost:5000/api/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"title\":\"Test Entry\",\"