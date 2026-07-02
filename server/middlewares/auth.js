// Authentication and authorization middlewares
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Authentication required" })
  }
  next()
}

const requireAdmin = (req, res, next) => {
  console.log("Admin check - Session user:", req.session.user)
  console.log("Admin check - Is admin:", req.session.isAdmin)

  if (!req.session.user || !req.session.isAdmin) {
    return res.status(403).json({ error: "Admin access required" })
  }
  next()
}

module.exports = {
  requireAuth,
  requireAdmin,
}
