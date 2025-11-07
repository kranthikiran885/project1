const User = require("../models/User")
const Vehicle = require("../models/Vehicle")
const Trip = require("../models/Trip")
const Payment = require("../models/Payment")

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const activeVehicles = await Vehicle.countDocuments({ status: "active" })
    const completedTrips = await Trip.countDocuments({ status: "completed" })
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    res.json({
      totalUsers,
      activeVehicles,
      completedTrips,
      totalRevenue: totalRevenue[0]?.total || 0,
      systemHealth: "Operational",
      timestamp: new Date(),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getDailyReport = async (req, res) => {
  try {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const trips = await Trip.countDocuments({ createdAt: { $gte: startOfDay } })
    const payments = await Payment.aggregate([
      { $match: { createdAt: { $gte: startOfDay }, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    res.json({
      date: startOfDay,
      tripsCompleted: trips,
      revenueGenerated: payments[0]?.total || 0,
      activeVehicles: await Vehicle.countDocuments({ status: "active" }),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getMonthlyReport = async (req, res) => {
  try {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const trips = await Trip.countDocuments({ createdAt: { $gte: startOfMonth } })
    const payments = await Payment.aggregate([
      { $match: { createdAt: { $gte: startOfMonth }, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    res.json({
      month: startOfMonth,
      tripsCompleted: trips,
      revenueGenerated: payments[0]?.total || 0,
      averagePerDay: Math.floor(trips / 30),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "suspended", updatedAt: new Date() },
      { new: true },
    ).select("-password")

    res.json({ message: "User suspended", user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateSystemSettings = async (req, res) => {
  try {
    // Store settings in a separate Settings collection or env
    const { maxVehicleOccupancy, maintenanceInterval, paymentGateway } = req.body

    res.json({
      message: "Settings updated",
      settings: {
        maxVehicleOccupancy,
        maintenanceInterval,
        paymentGateway,
        updatedAt: new Date(),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
