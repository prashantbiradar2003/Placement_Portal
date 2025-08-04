# 🔧 Login Debugging Guide

## 🚨 Current Status
✅ Backend is running on Render: `https://placement-portal-ir4x.onrender.com`
✅ API endpoints are accessible
❓ Login functionality needs debugging

## 📋 Step-by-Step Debugging

### Step 1: Check Browser Console
1. Open your frontend URL
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Try to login and check for error messages
5. Look for these specific errors:
   - CORS errors
   - Network errors
   - API response errors

### Step 2: Test API Endpoints Manually
```bash
# Test login endpoint
curl -X POST https://placement-portal-ir4x.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Step 3: Check Environment Variables
In your Render dashboard, verify these environment variables are set:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=5000
```

### Step 4: Verify Database Connection
1. Check if MongoDB Atlas is accessible
2. Verify connection string is correct
3. Ensure IP whitelist includes Render's IPs

### Step 5: Test User Registration
1. Try registering a new user first
2. Then try logging in with those credentials
3. Check if the user exists in MongoDB Atlas

## 🛠️ Quick Fixes

### Fix 1: Update CORS Configuration
If you see CORS errors, update your backend CORS settings.

### Fix 2: Check JWT_SECRET
Make sure JWT_SECRET is set in Render environment variables.

### Fix 3: Verify API URL
Ensure your frontend is pointing to the correct backend URL.

### Fix 4: Test Database Connection
Verify MongoDB connection is working properly.

## 📊 Common Error Messages & Solutions

### "Network Error"
- **Cause**: Backend not accessible
- **Solution**: Check Render service status

### "Invalid credentials"
- **Cause**: User doesn't exist or wrong password
- **Solution**: Register a user first, then login

### "Server error"
- **Cause**: Missing environment variables
- **Solution**: Set JWT_SECRET and MONGO_URI in Render

### "CORS error"
- **Cause**: Browser blocking cross-origin requests
- **Solution**: Backend CORS is already configured to allow all origins

## 🎯 Next Steps

1. **Check browser console** for specific error messages
2. **Test API endpoints** manually using curl
3. **Verify environment variables** in Render dashboard
4. **Register a test user** and try logging in
5. **Check MongoDB Atlas** for user data

## 📞 Need Help?

If you're still having issues:
1. Share the browser console error messages
2. Check Render logs for backend errors
3. Verify all environment variables are set
4. Test the API endpoints manually 