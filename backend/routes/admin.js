const express = require("express")
const adminController = require("../controllers/adminController")
const auth = require("../middleware/auth")

const router = express.Router()

router.get("/dashboard", auth, adminController.getDashboardStats)
router.get("/users", auth, adminController.getAllUsers)
router.get("/reports/daily", auth, adminController.getDailyReport)
router.get("/reports/monthly", auth, adminController.getMonthlyReport)
router.post("/users/:id/suspend", auth, adminController.suspendUser)
router.put("/settings", auth, adminController.updateSystemSettings)

module.exports = router
