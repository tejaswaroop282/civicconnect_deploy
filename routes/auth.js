// Authentication routes - handles user registration, login, and logout
const express = require("express")
const User = require("../models/User")
const router = express.Router()

// Show registration page
router.get("/register", (req, res) => {
  res.redirect("/register.html")
})

// Handle user registration
router.post("/register", async (req, res) => {
  try {
    console.log("Registration request body:", req.body)

    const { name, email, password, confirmPassword, phone } = req.body
    const trimmedName = name?.trim()
    const normalizedEmail = email?.trim().toLowerCase()
    const trimmedPhone = phone?.trim()

    // Basic validation
    if (!trimmedName || !normalizedEmail || !password || !trimmedPhone) {
      return res.status(400).json({ error: "All fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" })
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" })
    }

    // Create new user
    const user = new User({
      name: trimmedName,
      email: normalizedEmail,
      password,
      phone: trimmedPhone,
    })
    await user.save()

    console.log("✅ User registered successfully:", user.email)
    res.json({ success: true, message: "Registration successful! Please login." })
  } catch (error) {
    console.error("Registration error:", error)
    if (error.name === "ValidationError") {
      const firstValidationError = Object.values(error.errors)[0]
      return res.status(400).json({ error: firstValidationError?.message || "Invalid input data" })
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already registered" })
    }
    res.status(500).json({ error: "Registration failed. Please try again." })
  }
})

// Show login page
router.get("/login", (req, res) => {
  res.redirect("/login.html")
})

// Handle user login
router.post("/login", async (req, res) => {
  try {
    console.log("Login request body:", req.body)

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" })
    }

    // Create session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    }
    req.session.isAdmin = user.isAdmin

    console.log("✅ User logged in successfully:", user.email)

    // Return success with redirect URL
    const redirectUrl = user.isAdmin ? "/admin-dashboard.html" : "/dashboard.html"
    res.json({ success: true, redirectUrl })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed. Please try again." })
  }
})

// Check authentication status
router.get("/api/auth/check", (req, res) => {
  if (req.session.user) {
    res.json({
      success: true,
      user: {
        ...req.session.user,
        isAdmin: req.session.isAdmin || false,
      },
    })
  } else {
    res.status(401).json({ error: "Not authenticated" })
  }
})

// Handle logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err)
    }
    res.redirect("/")
  })
})

module.exports = router
