# ✅ Quick Start Checklist

Follow these steps in order:

## Before Starting

- [ ] Node.js installed (v16+)
- [ ] npm installed (v8+)
- [ ] Terminal/PowerShell open
- [ ] In correct directory: `cd "C:\backend project"`

## Setup Steps

- [ ] **Step 1:** Open `.env` file and verify MongoDB URI is correct
- [ ] **Step 2:** Run `npm install` and wait for completion
- [ ] **Step 3:** Run `npm start` to start the server
- [ ] **Step 4:** See "MongoDB Connected" and "Server running on port 5000" messages

## Testing

- [ ] **Step 5:** Open browser to http://localhost:5000
- [ ] **Step 6:** Click "Register" tab
- [ ] **Step 7:** Register with email and password
- [ ] **Step 8:** Login with same credentials
- [ ] **Step 9:** Click "+ New Entry" button
- [ ] **Step 10:** Create a diary entry and save
- [ ] **Step 11:** See entry appear in sidebar
- [ ] **Step 12:** Click entry to view it
- [ ] **Step 13:** Try editing the entry
- [ ] **Step 14:** Try searching by tag
- [ ] **Step 15:** Try deleting an entry

## Optional Advanced Testing

- [ ] Run `.\test-api.ps1` in PowerShell to test API directly
- [ ] Check MongoDB Atlas to see encrypted data
- [ ] Test on mobile browser (responsive design)
- [ ] Create multiple entries with different tags
- [ ] Test date range filtering

## If Something Goes Wrong

1. **Server won't start?**
   - Check if port 5000 is already in use
   - Verify all files are in correct locations
   - Run `npm install` again

2. **Can't connect to database?**
   - Check MongoDB URI in `.env`
   - Verify internet connection
   - Check MongoDB Atlas IP whitelist

3. **Frontend not loading?**
   - Verify `public` folder exists with all 3 files
   - Check browser console (F12) for errors
   - Try clearing browser cache

4. **API errors?**
   - Check server terminal for error messages
   - Verify JWT_SECRET is set in `.env`
   - Check MASTER_KEY is 64 hex characters

## Success Indicators

✅ Terminal shows: "MongoDB Connected"
✅ Terminal shows: "Server running on port 5000"
✅ Browser loads the login page
✅ Can register and login
✅ Can create and view entries
✅ Entries appear in sidebar
✅ Search and filter work

## You're Done! 🎉

When all checkboxes are checked, your project is working perfectly!

**Next Steps:**
- Take screenshots for portfolio
- Add more features
- Deploy to production
- Add to GitHub
- Update your resume
