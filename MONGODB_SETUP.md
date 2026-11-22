# 🗄️ MongoDB Atlas Setup Guide

## Quick Setup (5 Minutes)

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. Choose **FREE** tier (M0 Sandbox)

### Step 2: Create a Cluster
1. After signup, click **"Build a Database"**
2. Choose **FREE** tier (Shared)
3. Select a cloud provider (AWS recommended)
4. Choose a region close to you
5. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 3: Create Database User
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username: `diaryuser`
5. Click **"Autogenerate Secure Password"** (copy this!)
6. Set privileges to: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist Your IP
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://diaryuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the password you copied in Step 3

### Step 6: Update .env File
1. Open `.env` file in your project
2. Replace the MONGO_URI line with your connection string
3. Make sure to replace `<password>` with your actual password
4. Add `/diary` before the `?` to specify database name

**Example:**
```env
MONGO_URI=mongodb+srv://diaryuser:MySecurePass123@cluster0.xxxxx.mongodb.net/diary?retryWrites=true&w=majority
```

### Step 7: Test Connection
1. Save the `.env` file
2. Run: `npm start`
3. You should see: **"MongoDB Connected: cluster0.xxxxx.mongodb.net"**

---

## ✅ Success Indicators

You'll know it's working when you see:
```
MongoDB Connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
```

---

## 🔧 Troubleshooting

### Error: "bad auth : authentication failed"
**Solution:** 
- Check username and password are correct
- Make sure you replaced `<password>` in connection string
- Password should NOT have `<` or `>` symbols

### Error: "connection timed out"
**Solution:**
- Check Network Access in MongoDB Atlas
- Make sure your IP is whitelisted
- Try "Allow Access from Anywhere"

### Error: "MongoServerError"
**Solution:**
- Verify connection string format
- Make sure cluster is active (not paused)
- Check internet connection

---

## 📝 Quick Reference

**MongoDB Atlas Dashboard:** https://cloud.mongodb.com/

**Your connection string format:**
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/diary?retryWrites=true&w=majority
```

**Where to put it:**
In `.env` file, replace the MONGO_URI line

---

## 💡 Tips

1. **Save your password** - You can't view it again in MongoDB Atlas
2. **Use strong password** - MongoDB generates secure ones
3. **Whitelist IP** - For production, use specific IPs only
4. **Free tier limits** - 512MB storage (plenty for this project)

---

## 🎯 After Setup

Once MongoDB is connected:
1. Run `npm start`
2. Register a user in the app
3. Check MongoDB Atlas → Browse Collections
4. You'll see your encrypted data!

---

*Need help? The MongoDB Atlas interface is very user-friendly and has tooltips everywhere!*
