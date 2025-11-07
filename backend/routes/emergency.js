const express = require("express")
const emergencyController = require("../controllers/emergencyController")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/alert", auth, emergencyController.createEmergencyAlert)
router.get("/alerts", auth, emergencyController.getEmergencyAlerts)
router.get("/alerts/:id", auth, emergencyController.getAlertById)
router.put("/alerts/:id/resolve", auth, emergencyController.resolveAlert)
router.post("/alerts/:id/notify", auth, emergencyController.notifyUsers)

module.exports = router
