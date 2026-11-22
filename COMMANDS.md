# 📝 Command Reference

## Essential Commands

### Navigate to Project
```bash
cd "C:\backend project"
```

### Install Dependencies
```bash
npm install
```

### Start Server (Production)
```bash
npm start
```

### Start Server (Development - Auto-restart)
```bash
npm run dev
```

### Stop Server
Press `Ctrl + C` in the terminal

### Check if Server is Running
```bash
netstat -ano | findstr :5000
```

### View Package Info
```bash
npm list
```

### Update Dependencies
```bash
npm update
```

---

## Testing Commands

### Test API (PowerShell)
```powershell
.\test-api.ps1
```

### Manual API Test - Register
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
```

### Manual API Test - Login
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
```

---

## Troubleshooting Commands

### Kill Process on Port 5000 (if stuck)
```bash
# Find process ID
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Check Node/npm Versions
```bash
node --version
npm --version
```

---

## Git Commands (Optional)

### Initialize Git Repository
```bash
git init
```

### Add All Files
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Initial commit - Personal Diary API"
```

### Create .gitignore
```bash
echo node_modules/ > .gitignore
echo .env >> .gitignore
```

---

## MongoDB Commands (Optional)

### Connect to MongoDB (if mongosh installed)
```bash
mongosh "mongodb+srv://parvati:oaK3narnzJRu9HlE@cluster0.e9aprnc.mongodb.net/diary"
```

### View Collections
```javascript
show collections
```

### View Users
```javascript
db.users.find().pretty()
```

### View Entries (Encrypted)
```javascript
db.entries.find().pretty()
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Start server | `npm start` |
| Stop server | `Ctrl + C` |
| Open app | http://localhost:5000 |
| Test API | `.\test-api.ps1` |
| Install packages | `npm install` |
| Check port | `netstat -ano \| findstr :5000` |

---

## Environment Variables

Edit `.env` file to change:

```env
PORT=5000                    # Server port
MONGO_URI=mongodb://...      # Database connection
JWT_SECRET=your_secret       # JWT signing key
MASTER_KEY=64_hex_chars      # Encryption master key
```

---

## File Locations

| File | Purpose |
|------|---------|
| `server.mjs` | Main entry point |
| `app.mjs` | Express app setup |
| `.env` | Environment variables |
| `package.json` | Dependencies |
| `public/index.html` | Frontend UI |
| `SETUP_GUIDE.md` | Full setup instructions |
| `CHECKLIST.md` | Quick checklist |

---

## URLs

- **Frontend:** http://localhost:5000
- **API Base:** http://localhost:5000/api
- **Register:** http://localhost:5000/api/auth/register
- **Login:** http://localhost:5000/api/auth/login
- **Entries:** http://localhost:5000/api/entries

---

## Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Port in use | Change PORT in `.env` or kill process |
| Module not found | Run `npm install` |
| MongoDB error | Check MONGO_URI in `.env` |
| Can't login | Check JWT_SECRET is set |
| Encryption error | Verify MASTER_KEY is 64 hex chars |

---

## That's It!

Keep this file handy for quick reference. 🚀
