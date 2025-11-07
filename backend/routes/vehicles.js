const express = require("express")
const vehicleController = require("../controllers/vehicleController")
const auth = require("../middleware/auth")

const router = express.Router()

router.get("/", vehicleController.getAllVehicles)
router.get("/:id", vehicleController.getVehicleById)
router.post("/", auth, vehicleController.createVehicle)
router.put("/:id/location", vehicleController.updateVehicleLocation)
router.put("/:id/status", auth, vehicleController.updateVehicleStatus)
router.post("/:id/maintenance", auth, vehicleController.addMaintenanceRecord)

module.exports = router
