// Routes for handling civic issues - reporting, viewing, and managing
const express = require("express")
const multer = require("multer")
const path = require("path")
const Issue = require("../models/Issue")
const User = require("../models/User")
const { classifyIssue } = require("../services/classificationAgent")
const { classifyIssueWithGemini } = require("../services/geminiAgent")
const { findNearbyDuplicate } = require("../services/duplicateAgent")
const { calculateDeadline } = require("../services/slaAgent")
const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "issue-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"), false)
    }
  },
})

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Authentication required" })
  }
  next()
}

// Show report issue page
router.get("/report", (req, res) => {
  res.redirect("/report.html")
})

// Handle issue reporting
router.post("/api/issues/report", requireAuth, upload.single("image"), async (req, res) => {
  try {
    console.log("Issue report request:", req.body)
    console.log("File:", req.file)

    const { title, description, category, location, latitude, longitude, priority } = req.body
    const lat = Number.parseFloat(latitude)
    const lng = Number.parseFloat(longitude)

    // Basic validation
    if (!title || !description || !location) {
      return res.status(400).json({ error: "All required fields must be filled" })
    }
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: "Please select a valid location on the map" })
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ error: "Latitude/longitude values are out of range" })
    }

    // 1) Local rule-based classification first.
    //    If it can't classify, fall back to Gemini (only if it returns a valid category).
    const classifiedCategory = await classifyIssue(description)
    let issueCategory = classifiedCategory || category
    if (!classifiedCategory) {
      const geminiCategory = await classifyIssueWithGemini(description)
      if (geminiCategory) issueCategory = geminiCategory
    }
    if (!issueCategory) {
      return res.status(400).json({ error: "Category is required or could not be classified" })
    }

    // 2) Find nearby duplicate issue within 100 meters
    const nearbyDuplicate = await findNearbyDuplicate(issueCategory, lng, lat)

    // 3) Calculate SLA deadline for selected category
    const deadline = calculateDeadline(issueCategory)

    // Create new issue
    const issueData = {
      title: title.trim(),
      description: description.trim(),
      category: issueCategory,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      priority: priority || "medium",
      reportedBy: req.session.user.id,
      deadline,
    }

    // 4) Mark duplicate metadata when a nearby issue exists
    if (nearbyDuplicate) {
      issueData.isDuplicate = true
      issueData.duplicateOf = nearbyDuplicate._id
    }

    // Add image URL if file was uploaded
    if (req.file) {
      issueData.imageUrl = `/uploads/${req.file.filename}`
    }

    const issue = new Issue(issueData)
    await issue.save()

    res.json({
      success: true,
      message: "Issue reported successfully!",
      issueId: issue._id,
    })
  } catch (error) {
    console.error("Issue reporting error:", error)
    res.status(500).json({ error: "Failed to report issue. Please try again." })
  }
})

// Get user's issues
router.get("/api/issues/my-issues", requireAuth, async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.session.user.id })
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 })

    res.json({ success: true, issues })
  } catch (error) {
    console.error("Error fetching user issues:", error)
    res.status(500).json({ error: "Failed to fetch issues" })
  }
})

// Get single issue details
router.get("/api/issues/:id", requireAuth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate("reportedBy", "name email")

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" })
    }

    // Check if user can view this issue (owner or admin)
    if (!req.session.isAdmin && issue.reportedBy._id.toString() !== req.session.user.id) {
      return res.status(403).json({ error: "Access denied" })
    }

    res.json({ success: true, issue })
  } catch (error) {
    console.error("Error fetching issue:", error)
    res.status(500).json({ error: "Failed to fetch issue details" })
  }
})

// Show user dashboard
router.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login.html")
  }
  res.redirect("/dashboard.html")
})

module.exports = router
