// Authentication routes - maps endpoints to authController
const express = require("express")
const authController = require("../controllers/authController")
const router = express.Router()

// Handle user registration
router.post("/register", authController.registerUser)

// Handle user login
router.post("/login", authController.loginUser)

// Check authentication status
router.get("/api/auth/check", authController.checkAuth)

// Handle logout
router.get("/logout", authController.logoutUser)

module.exports = router
