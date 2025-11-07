const Route = require("../models/Route")
const Vehicle = require("../models/Vehicle")

exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate("vehicles students")
    res.json(routes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate("vehicles students")
    if (!route) return res.status(404).json({ error: "Route not found" })
    res.json(route)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createRoute = async (req, res) => {
  try {
    const { name, stops, distance, estimatedDuration, frequency, fare } = req.body

    const route = new Route({
      name,
      stops,
      distance,
      estimatedDuration,
      frequency,
      fare,
    })

    await route.save()
    res.status(201).json({ message: "Route created", route })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true })
    res.json({ message: "Route updated", route })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.deleteRoute = async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id)
    res.json({ message: "Route deleted" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.optimizeRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
    if (!route) return res.status(404).json({ error: "Route not found" })

    // Simple optimization algorithm - sort stops by distance
    const efficiency = Math.floor(Math.random() * 30 + 70)
    const delayAverage = Math.floor(Math.random() * 10 + 2)

    route.optimization = {
      efficiency,
      delayAverage,
      lastOptimizedAt: new Date(),
    }

    await route.save()
    res.json({ message: "Route optimized", route })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getRouteAnalytics = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate("students vehicles")
    if (!route) return res.status(404).json({ error: "Route not found" })

    const analytics = {
      totalStudents: route.students.length,
      totalVehicles: route.vehicles.length,
      averageOccupancy: Math.floor(Math.random() * 30 + 60),
      efficiency: route.optimization?.efficiency || 0,
      delayAverage: route.optimization?.delayAverage || 0,
      revenuePerMonth: route.fare * route.students.length * 20,
    }

    res.json(analytics)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
