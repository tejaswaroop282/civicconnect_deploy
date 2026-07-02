// Routes for handling civic issues - maps endpoints to issuesController
const express = require("express")
const issuesController = require("../controllers/issuesController")
const { requireAuth } = require("../middlewares/auth")
const upload = require("../middlewares/upload")
const router = express.Router()

// Handle issue reporting
router.post("/api/issues/report", requireAuth, upload.single("image"), issuesController.reportIssue)

// Get user's issues
router.get("/api/issues/my-issues", requireAuth, issuesController.getUserIssues)

// Get single issue details
router.get("/api/issues/:id", requireAuth, issuesController.getIssueById)

module.exports = router
