# 🔧 Troubleshooting Guide: Login Issues on Render

## 🚨 Common Issues and Solutions

### 1. **API URL Configuration Issue**

**Problem**: Frontend can't connect to backend API
**Solution**: 
- Verify your Render URL in `frontend/config.js`
- Check if the URL is correct: `https://placement-portal-ir4x.onrender.com`

**Test**: Open browser console and check for API request logs

### 2. **CORS Issues**

**Problem**: Browser blocks requests due to CORS policy
**Solution**: 
- Backend is configured to allow all origins (`*`)
- Check browser console for CORS errors

### 3. **Environment Variables Missing**

**Problem**: Backend fails to start or JWT doesn't work
**Solution**: Set these in Render dashboard:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=5000
```

### 4. **Database Connection Issues**

**Problem**: MongoDB connection fails
**Solution**:
- Verify MongoDB Atlas connection string
- Check if IP whitelist includes Render's IPs
- Ensure username/password are correct

### 5. **Render Service Not Running**

**Problem**: Backend service is down
**Solution**:
- Check Render dashboard for service status
- Look at build logs for errors
- Restart the service if needed

## 🔍 Debugging Steps

### Step 1: Test Backend Health
```bash
# Test your Render URL
curl https://placement-portal-ir4x.onrender.com/health
```

### Step 2: Check Browser Console
1. Open your frontend URL
2. Open browser developer tools (F12)
3. Go to Console tab
4. Try to login and check for error messages

### Step 3: Test API Endpoints
```bash
# Test basic endpoint
curl https://placement-portal-ir4x.onrender.com/

# Test auth endpoint
curl https://placement-portal-ir4x.onrender.com/api/auth/check
```

### Step 4: Verify Environment Variables
Check Render dashboard:
1. Go to your service
2. Click "Environment" tab
3. Verify all required variables are set

## 🛠️ Quick Fixes

### Fix 1: Update API URL
If your Render URL is different, update `frontend/config.js`:
```javascript
apiBaseUrl: "https://your-actual-render-url.onrender.com"
```

### Fix 2: Add Missing Environment Variables
In Render dashboard, add:
```
JWT_SECRET=your-super-secret-jwt-key-here
MONGO_URI=your-mongodb-connection-string
NODE_ENV=production
```

### Fix 3: Check MongoDB Atlas
1. Go to MongoDB Atlas dashboard
2. Check if your cluster is running
3. Verify network access allows all IPs (0.0.0.0/0)
4. Test connection string

### Fix 4: Restart Render Service
1. Go to Render dashboard
2. Find your service
3. Click "Manual Deploy"
4. Select "Clear build cache & deploy"

## 📊 Testing Checklist

- [ ] Backend service is running on Render
- [ ] Environment variables are set correctly
- [ ] MongoDB Atlas is accessible
- [ ] Frontend can reach backend API
- [ ] CORS is not blocking requests
- [ ] JWT_SECRET is set
- [ ] Database connection is working

## 🆘 Still Having Issues?

1. **Check Render Logs**: Go to your service dashboard and check the logs
2. **Test Locally**: Run the backend locally to see if it works
3. **Check MongoDB**: Verify your database connection
4. **Browser Console**: Look for specific error messages

## 📞 Common Error Messages

### "Network Error"
- Backend service is down
- Wrong API URL
- CORS issue

### "Invalid credentials"
- User doesn't exist
- Wrong password
- Database connection issue

### "Server error"
- Environment variables missing
- Database connection failed
- JWT_SECRET not set

## 🎯 Next Steps

1. Run the test script: `node test-deployment.js`
2. Check browser console for detailed error messages
3. Verify your Render URL is correct
4. Ensure all environment variables are set
5. Test the login functionality step by step 