const User = require("../models/User")
const Vehicle = require("../models/Vehicle")
const Trip = require("../models/Trip")
const Route = require("../models/Route")
const Payment = require("../models/Payment")
const EmergencyAlert = require("../models/EmergencyAlert")

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalVehicles,
      activeTrips,
      totalRoutes,
      monthlyRevenue,
      emergencyAlerts,
      studentsCount,
      driversCount
    ] = await Promise.all([
      User.countDocuments(),
      Vehicle.countDocuments({ status: 'active' }),
      Trip.countDocuments({ status: 'in-progress' }),
      Route.countDocuments(),
      Payment.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            },
            status: 'completed'
          }
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      EmergencyAlert.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'driver' })
    ])

    const revenue = monthlyRevenue[0]?.total || 0

    res.json({
      totalUsers,
      activeVehicles: totalVehicles,
      activeTrips,
      totalRoutes,
      monthlyRevenue: revenue,
      emergencyAlerts,
      studentsCount,
      driversCount,
      safetyScore: 98.5, // Calculate based on incidents
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ error: error.message })
  }
}

exports.getRealtimeStats = async (req, res) => {
  try {
    const [activeTrips, onlineDrivers, emergencyAlerts] = await Promise.all([
      Trip.find({ status: 'in-progress' })
        .populate('vehicle', 'registrationNumber gpsLocation')
        .populate('driver', 'name phone')
        .populate('route', 'name'),
      User.find({ 
        role: 'driver', 
        lastLogin: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Last 30 minutes
      }),
      EmergencyAlert.find({ status: 'active' })
        .populate('user', 'name role')
        .sort({ createdAt: -1 })
    ])

    res.json({
      activeTrips: activeTrips.length,
      onlineDrivers: onlineDrivers.length,
      emergencyAlerts: emergencyAlerts.length,
      trips: activeTrips,
      alerts: emergencyAlerts,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Realtime stats error:', error)
    res.status(500).json({ error: error.message })
  }
}

exports.getAnalytics = async (req, res) => {
  try {
    const { period = 'week' } = req.query
    let startDate = new Date()
    
    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
    }

    const [tripAnalytics, revenueAnalytics, routeEfficiency] = await Promise.all([
      Trip.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Payment.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startDate },
            status: 'completed'
          } 
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: '$amount' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Route.aggregate([
        {
          $lookup: {
            from: 'trips',
            localField: '_id',
            foreignField: 'route',
            as: 'trips'
          }
        },
        {
          $project: {
            name: 1,
            efficiency: '$optimization.efficiency',
            tripCount: { $size: '$trips' },
            avgDelay: '$optimization.delayAverage'
          }
        }
      ])
    ])

    res.json({
      period,
      tripAnalytics,
      revenueAnalytics,
      routeEfficiency,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ error: error.message })
  }
}

exports.getDailyReport = async (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0] } = req.query
    const startDate = new Date(date)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 1)

    const [trips, payments, alerts, vehicles] = await Promise.all([
      Trip.find({
        createdAt: { $gte: startDate, $lt: endDate }
      }).populate('vehicle route driver'),
      Payment.find({
        createdAt: { $gte: startDate, $lt: endDate }
      }).populate('user'),
      EmergencyAlert.find({
        createdAt: { $gte: startDate, $lt: endDate }
      }).populate('user'),
      Vehicle.find({ status: 'active' }).populate('driver route')
    ])

    const summary = {
      totalTrips: trips.length,
      completedTrips: trips.filter(t => t.status === 'completed').length,
      totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
      emergencyAlerts: alerts.length,
      activeVehicles: vehicles.length
    }

    res.json({
      date,
      summary,
      trips,
      payments,
      alerts,
      vehicles,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('Daily report error:', error)
    res.status(500).json({ error: error.message })
  }
}