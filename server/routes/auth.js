// Authentication routes - maps endpoints to authController
const express = require("express")
const authController = require("../controllers/authController")
const router = express.Router()

// Show registration page
router.get("/register", authController.showRegister)

// Handle user registration
router.post("/register", authController.registerUser)

// Show login page
router.get("/login", authController.showLogin)

// Handle user login
router.post("/login", authController.loginUser)

// Check authentication status
router.get("/api/auth/check", authController.checkAuth)

// Handle logout
router.get("/logout", authController.logoutUser)

module.exports = router
