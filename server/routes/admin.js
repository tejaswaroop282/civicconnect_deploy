// Admin routes - maps endpoints to adminController
const express = require("express")
const adminController = require("../controllers/adminController")
const { requireAdmin } = require("../middlewares/auth")
const router = express.Router()

// Get all issues for admin dashboard
router.get("/api/admin/issues", requireAdmin, adminController.getAdminIssues)

// Get dashboard statistics and filtered issues
router.get("/api/admin/dashboard", requireAdmin, adminController.getDashboardData)

// Update issue status (admin only)
router.put("/api/admin/issues/:id/update", requireAdmin, adminController.updateIssue)

// Update issue (alternative endpoint for compatibility)
router.put("/api/admin/issues/:id", requireAdmin, adminController.updateIssue)

// Get admin statistics only
router.get("/api/admin/stats", requireAdmin, adminController.getAdminStats)

// Delete issue (admin only)
router.delete("/api/admin/issues/:id", requireAdmin, adminController.deleteIssue)

module.exports = router
