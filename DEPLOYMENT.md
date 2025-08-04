# 🚀 Deployment Guide: Netlify + Render

This guide will help you deploy your College Placement Portal to:
- **Frontend**: Netlify (client folder)
- **Backend**: Render (server folder)
- **Database**: MongoDB Atlas

---

## 📋 Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **MongoDB Atlas Account**: For cloud database
3. **Netlify Account**: For frontend hosting
4. **Render Account**: For backend hosting

---

## 🗄️ Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Choose "Free" tier
   - Select your preferred region
   - Create cluster

3. **Set Up Database Access**
   - Go to "Database Access"
   - Create a new user with read/write permissions
   - Save username and password

4. **Set Up Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)

5. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

---

## 🔧 Step 2: Prepare Your Code

### A. Update Configuration Files

1. **Update `frontend/config.js`**
   ```javascript
   // Replace with your actual Render URL
   apiBaseUrl: "https://placement-portal-ir4x.onrender.com"
   ```

2. **Update `backend/server.js`**
   ```javascript
   // Replace with your actual Netlify URL
   origin: ['https://your-frontend-app.netlify.app']
   ```

### B. Environment Variables

Create a `.env` file in your `backend/` folder:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/college-placement-portal
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

---

## 🌐 Step 3: Deploy Backend to Render

1. **Sign Up for Render**
   - Go to [Render](https://render.com)
   - Sign up with your GitHub account

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure the Service**
   - **Name**: `college-placement-backend`
   - **Root Directory**: `backend` (if your backend code is in a backend folder)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node 18` or higher

4. **Add Environment Variables**
   - Go to "Environment" tab
   - Add these variables:
     ```
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/college-placement-portal
     NODE_ENV=production
     JWT_SECRET=your-super-secret-jwt-key
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the generated URL (e.g., `https://your-app.onrender.com`)

---

## 🎨 Step 4: Deploy Frontend to Netlify

1. **Sign Up for Netlify**
   - Go to [Netlify](https://netlify.com)
   - Sign up with your GitHub account

2. **Create New Site**
   - Click "New site from Git"
   - Choose GitHub
   - Select your repository

3. **Configure Build Settings**
   - **Base directory**: `frontend` (if your frontend is in a frontend folder)
   - **Build command**: Leave empty (static site)
   - **Publish directory**: `.` (current directory)

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Copy the generated URL (e.g., `https://your-app.netlify.app`)

---

## ⚙️ Step 5: Update URLs

1. **Update Backend CORS**
   - Go to your Render dashboard
   - Update the CORS origin in `server/server.js` with your Netlify URL
   - Redeploy

2. **Update Frontend API URLs**
   - Go to your GitHub repository
   - Update `client/config.js` with your Render URL
   - Push changes
   - Netlify will automatically redeploy

---

## 🔍 Step 6: Test Your Deployment

1. **Test Frontend**
   - Visit your Netlify URL
   - Try to register/login
   - Check if API calls work

2. **Test Backend**
   - Visit your Render URL
   - You should see "College Placement Portal Backend is running"

3. **Test Database**
   - Try creating a user
   - Check if data appears in MongoDB Atlas

---

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Make sure your Render URL is in the CORS origin list
   - Check that the frontend URL is correct

2. **Database Connection Issues**
   - Verify your MongoDB Atlas connection string
   - Check if your IP is whitelisted
   - Ensure username/password are correct

3. **Environment Variables**
   - Make sure all environment variables are set in Render
   - Check that JWT_SECRET is set

4. **Build Errors**
   - Check the build logs in Render/Netlify
   - Ensure all dependencies are in package.json

---

## 📞 Support

If you encounter issues:
1. Check the deployment logs in Render/Netlify
2. Verify all URLs are correct
3. Test locally first
4. Check MongoDB Atlas connection

---

## 🎉 Success!

Your College Placement Portal is now live on:
- **Frontend**: https://your-app.netlify.app
- **Backend**: https://your-app.onrender.com
- **Database**: MongoDB Atlas

Remember to:
- Keep your environment variables secure
- Monitor your usage (free tiers have limits)
- Set up custom domains if needed 