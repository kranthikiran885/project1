const Vehicle = require("../models/Vehicle")
const Route = require("../models/Route")

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("driver route")
    res.json(vehicles)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate("driver route")
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" })
    res.json(vehicle)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createVehicle = async (req, res) => {
  try {
    const { registrationNumber, capacity, model, fuelType, color, route, driver } = req.body

    const vehicle = new Vehicle({
      registrationNumber,
      capacity,
      model,
      fuelType,
      color,
      route,
      driver,
    })

    await vehicle.save()
    await vehicle.populate("driver route")
    res.status(201).json({ message: "Vehicle created", vehicle })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateVehicleLocation = async (req, res) => {
  try {
    const { lat, lng, speed } = req.body
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        gpsLocation: { lat, lng, updatedAt: new Date() },
        speed,
      },
      { new: true },
    )
    res.json(vehicle)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateVehicleStatus = async (req, res) => {
  try {
    const { status } = req.body
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, { status, updatedAt: new Date() }, { new: true })
    res.json(vehicle)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.addMaintenanceRecord = async (req, res) => {
  try {
    const { type, cost, description, mechanic } = req.body
    const vehicle = await Vehicle.findById(req.params.id)
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" })

    vehicle.maintenanceHistory.push({
      date: new Date(),
      type,
      cost,
      description,
      mechanic,
    })

    await vehicle.save()
    res.json({ message: "Maintenance record added", vehicle })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
