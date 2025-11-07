const express = require("express")
const tripController = require("../controllers/tripController")
const auth = require("../middleware/auth")

const router = express.Router()

router.get("/", tripController.getAllTrips)
router.get("/:id", tripController.getTripById)
router.post("/", auth, tripController.createTrip)
router.put("/:id/start", auth, tripController.startTrip)
router.put("/:id/end", auth, tripController.endTrip)
router.post("/:id/board-student", auth, tripController.boardStudent)

module.exports = router
