// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Route imports
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/job");
const applicationRoutes = require("./routes/application");
const uploadRoutes = require("./routes/upload");
const apiRoutes = require("./routes/api");

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://college-placement-portal.netlify.app', 'https://college-placement-portal.com'] // Your Netlify URLs
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Increase JSON body parser limit
app.use(express.json({ limit: '100mb' }));
// Increase URL-encoded body parser limit
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads directory");
}

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));
console.log("✅ Static file serving for uploads configured at", path.join(__dirname, "uploads"));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", apiRoutes);

// Test
app.get("/", (req, res) => {
  res.send("College Placement Portal Backend is running.");
});

// Catch-all route to serve frontend for any unknown route (for SPA or direct HTML access)
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
// });

// DB + Server
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/college-placement-portal";
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("❌ MongoDB connection failed:", err));
