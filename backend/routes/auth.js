const express = require("express")
const authController = require("../controllers/authController")
const auth = require("../middleware/auth")

const router = express.Router()

// Authentication routes
router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/profile", auth, authController.getProfile)
router.put("/profile", auth, authController.updateProfile)

// Real-time validation routes
router.post("/check-email", authController.checkEmail)
router.post("/check-phone", authController.checkPhone)

module.exports = router
