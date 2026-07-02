const Issue = require("../models/Issue")
const User = require("../models/User")

// Show admin dashboard
const showAdminDashboard = (req, res) => {
  if (!req.session.user || !req.session.isAdmin) {
    return res.redirect("/login.html")
  }
  res.redirect("/admin-dashboard.html")
}

// Get all issues for admin dashboard
const getAdminIssues = async (req, res) => {
  try {
    console.log("Fetching admin issues...")

    const { status, category, priority } = req.query

    // Build filter object
    const filter = {}
    if (status && status !== "") filter.status = status
    if (category && category !== "") filter.category = category
    if (priority && priority !== "") filter.priority = priority

    console.log("Filter applied:", filter)

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name email phone")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 })

    console.log(`Found ${issues.length} issues`)

    res.json({ success: true, issues })
  } catch (error) {
    console.error("Error fetching admin issues:", error)
    res.status(500).json({ error: "Failed to fetch issues" })
  }
}

// Get dashboard statistics and filtered issues
const getDashboardData = async (req, res) => {
  try {
    console.log("Fetching dashboard data...")

    const { status, category, priority } = req.query

    // Build filter object for issues
    const filter = {}
    if (status && status !== "") filter.status = status
    if (category && category !== "") filter.category = category
    if (priority && priority !== "") filter.priority = priority

    // Get filtered issues
    const issues = await Issue.find(filter)
      .populate("reportedBy", "name email phone")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 })

    // Calculate statistics
    const totalIssues = await Issue.countDocuments()
    const pendingIssues = await Issue.countDocuments({ status: "pending" })
    const inProgressIssues = await Issue.countDocuments({ status: "in-progress" })
    const resolvedIssues = await Issue.countDocuments({ status: "resolved" })
    const totalUsers = await User.countDocuments({ isAdmin: false })

    const stats = {
      total: totalIssues,
      pending: pendingIssues,
      inProgress: inProgressIssues,
      resolved: resolvedIssues,
      totalUsers,
    }

    console.log("Dashboard stats:", stats)
    console.log(`Returning ${issues.length} filtered issues`)

    res.json({
      success: true,
      issues,
      stats,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    res.status(500).json({ error: "Failed to fetch dashboard data" })
  }
}

// Update issue status (admin only)
const updateIssue = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body
    const issueId = req.params.id

    console.log(`Updating issue ${issueId}:`, { status, adminRemarks })

    // Validate status
    const validStatuses = ["pending", "in-progress", "resolved"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const issue = await Issue.findById(issueId)
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" })
    }

    // Update issue
    issue.status = status
    if (adminRemarks !== undefined) {
      issue.adminRemarks = adminRemarks.trim()
    }
    issue.assignedTo = req.session.user.id
    issue.updatedAt = new Date()

    await issue.save()

    console.log("✅ Issue updated successfully")

    res.json({
      success: true,
      message: "Issue updated successfully",
      issue,
    })
  } catch (error) {
    console.error("Error updating issue:", error)
    res.status(500).json({ error: "Failed to update issue" })
  }
}

// Get admin statistics only
const getAdminStats = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments()
    const pendingIssues = await Issue.countDocuments({ status: "pending" })
    const inProgressIssues = await Issue.countDocuments({ status: "in-progress" })
    const resolvedIssues = await Issue.countDocuments({ status: "resolved" })
    const totalUsers = await User.countDocuments({ isAdmin: false })

    const stats = {
      totalIssues,
      pendingIssues,
      inProgressIssues,
      resolvedIssues,
      totalUsers,
    }

    res.json({ success: true, stats })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    res.status(500).json({ error: "Failed to fetch statistics" })
  }
}

// Delete issue (admin only)
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" })
    }

    await Issue.findByIdAndDelete(req.params.id)
    console.log("✅ Issue deleted successfully")

    res.json({ success: true, message: "Issue deleted successfully" })
  } catch (error) {
    console.error("Error deleting issue:", error)
    res.status(500).json({ error: "Failed to delete issue" })
  }
}

module.exports = {
  showAdminDashboard,
  getAdminIssues,
  getDashboardData,
  updateIssue,
  getAdminStats,
  deleteIssue,
}
