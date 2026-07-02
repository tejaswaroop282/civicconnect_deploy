// Main application file - Entry point for CivicConnect platform
const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const path = require("path")
const methodOverride = require("method-override")
const { startSlaMonitor } = require("./jobs/slaMonitor")
require("dotenv").config({ path: path.join(__dirname, ".env") })

const app = express()
const PORT = process.env.PORT || 3000

// Import route files
const authRoutes = require("./routes/auth")
const issueRoutes = require("./routes/issues")
const adminRoutes = require("./routes/admin")

// Database connection to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/civicconnect")
  .then(() => {
    console.log("✅ Connected to MongoDB")
    startSlaMonitor()
    console.log("⏰ SLA monitor started (runs every hour)")
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Middleware setup
app.use(express.urlencoded({ extended: true })) // Parse form data
app.use(express.json()) // Parse JSON data
app.use(methodOverride("_method")) // Support PUT/DELETE methods in forms

// Session configuration for user authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET || "civicconnect-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: false, // Set to true in production with HTTPS
    },
  }),
)

// Serve static files (CSS, JS, images, uploads)
app.use(express.static(path.join(__dirname, "../client/public")))
app.use(express.static(path.join(__dirname, "../client/views")))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Route handlers
app.use("/", authRoutes) // Authentication routes (login, register, logout)
app.use("/", issueRoutes) // Issue reporting and viewing routes
app.use("/", adminRoutes) // Admin panel routes

// Home page route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/views", "index.html"))
})

// 404 Error handler for undefined routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../client/views", "404.html"))
})

// Global error handler
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid request payload. Please refresh and try again." })
  }
  console.error("Server Error:", err)
  if (req.originalUrl.startsWith("/register") || req.originalUrl.startsWith("/login")) {
    return res.status(500).json({ error: "Request failed. Please try again." })
  }
  res.status(500).sendFile(path.join(__dirname, "../client/views", "500.html"))
})

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 CivicConnect server running on http://localhost:${PORT}`)
  console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin-dashboard.html`)
  console.log(`👤 User Dashboard: http://localhost:${PORT}/dashboard.html`)
})