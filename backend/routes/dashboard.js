const express = require("express")
const dashboardController = require("../controllers/dashboardController")
const auth = require("../middleware/auth")

const router = express.Router()

// Dashboard routes - require authentication
router.get("/stats", auth, dashboardController.getDashboardStats)
router.get("/realtime-stats", auth, dashboardController.getRealtimeStats)
router.get("/analytics", auth, dashboardController.getAnalytics)
router.get("/reports/daily", auth, dashboardController.getDailyReport)

module.exports = router