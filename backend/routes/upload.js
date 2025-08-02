const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const fs = require("fs");
const jwt = require("jsonwebtoken");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads directory:", uploadDir);
}

// Ensure resumes directory exists
const resumeDir = path.join(uploadDir, "resumes");
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
  console.log("Created resumes directory:", resumeDir);
}

// Set storage destination for resumes
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeDir);
  },
  filename: (req, file, cb) => {
    // Keep extension but sanitize and make unique filename
    const fileExt = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExt).replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueName = `${req.user.id}_${baseName}_${Date.now()}${fileExt}`;
    cb(null, uniqueName);
  }
});

// Filter for pdf files
const resumeFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// Setup upload middleware
const uploadResume = multer({ 
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to verify token from POST request
const verifyPostToken = async (req, res, next) => {
  try {
    // Check for token in POST body
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// GET and POST /api/upload/resume/:userId - Get a student's resume with proper authorization
router.get("/resume/:userId", auth, handleResumeRequest);
router.post("/resume/:userId", verifyPostToken, handleResumeRequest);

// POST /api/upload/resume - Upload a resume
router.post("/resume", auth, uploadResume.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // Update user's resume information in database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Store relative path from uploads directory
    const relativePath = path.join('resumes', req.file.filename);
    
    user.resume = {
      filename: req.file.originalname,
      path: relativePath,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadDate: Date.now()
    };

    await user.save();

    res.json({ 
      msg: "Resume uploaded successfully",
      resume: user.resume
    });
  } catch (err) {
    console.error("Error uploading resume:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Shared handler for resume requests
async function handleResumeRequest(req, res) {
  try {
    console.log("Accessing resume for user:", req.params.userId);
    console.log("User role:", req.user.role);
    
    // Check if the requesting user has permission to view this resume
    const isStudent = req.user.role === "student";
    const isOfficer = req.user.role === "officer";
    const isRecruiter = req.user.role === "recruiter";

    console.log("User roles:", { isStudent, isOfficer, isRecruiter });

    // Students can only view their own resumes
    if (isStudent && req.user.id !== req.params.userId) {
      return res.status(403).json({ msg: "Access denied" });
    }

    // Officers have access to all resumes
    if (!isOfficer && !isStudent && !isRecruiter) {
      return res.status(403).json({ msg: "Access denied" });
    }

    // Get the user's resume data
    const user = await User.findById(req.params.userId);
    console.log("Found user:", user ? "yes" : "no");
    console.log("Resume data:", user?.resume);

    if (!user || !user.resume || !user.resume.path) {
      return res.status(404).json({ msg: "Resume not found" });
    }

    // Get the full path to the resume file - Fix path resolution
    const resumePath = path.join(__dirname, '..', 'uploads', 'resumes', path.basename(user.resume.path));
    console.log("Resume path:", resumePath);
    console.log("File exists:", fs.existsSync(resumePath));

    // Check if file exists
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ msg: "Resume file not found" });
    }

    // Set the appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${user.resume.filename || 'resume.pdf'}"`);

    // Stream the file directly
    const fileStream = fs.createReadStream(resumePath);
    fileStream.on('error', (err) => {
      console.error("Error streaming file:", err);
      res.status(500).json({ msg: "Error streaming file" });
    });
    fileStream.pipe(res);
  } catch (err) {
    console.error("Error accessing resume:", err);
    res.status(500).json({ msg: "Server error" });
  }
}

module.exports = router;
