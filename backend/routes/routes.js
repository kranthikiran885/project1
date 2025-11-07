const express = require("express")
const routeController = require("../controllers/routeController")
const auth = require("../middleware/auth")

const router = express.Router()

router.get("/", routeController.getAllRoutes)
router.get("/:id", routeController.getRouteById)
router.post("/", auth, routeController.createRoute)
router.put("/:id", auth, routeController.updateRoute)
router.delete("/:id", auth, routeController.deleteRoute)
router.post("/:id/optimize", auth, routeController.optimizeRoute)
router.get("/:id/analytics", auth, routeController.getRouteAnalytics)

module.exports = router
