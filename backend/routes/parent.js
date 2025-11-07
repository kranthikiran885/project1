const express = require("express")
const User = require("../models/User")
const Trip = require("../models/Trip")
const Vehicle = require("../models/Vehicle")
const auth = require("../middleware/auth")

const router = express.Router()

// Get child information for parent
router.get("/child-info", auth, async (req, res) => {
  try {
    const parent = await User.findById(req.user.id)
    if (!parent || parent.role !== 'parent') {
      return res.status(403).json({ error: "Access denied" })
    }

    // In a real app, you'd have a relationship between parent and child
    // For now, we'll return mock data based on parent's childName
    const childData = {
      name: parent.childName || "Student Name",
      studentId: "STU" + Math.random().toString().substr(2, 6),
      class: "Grade 10-A",
      school: parent.childCollege || "School Name",
      busNumber: "B-42",
      route: "Route-A",
      currentLocation: "Main Street Junction",
      eta: "8 mins",
      attendance: 95,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      emergencyContacts: [
        { name: "School Office", phone: "+1-555-0123" },
        { name: "Bus Driver", phone: "+1-555-0456" }
      ]
    }

    res.json(childData)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get child's attendance records
router.get("/child-attendance", auth, async (req, res) => {
  try {
    const parent = await User.findById(req.user.id)
    if (!parent || parent.role !== 'parent') {
      return res.status(403).json({ error: "Access denied" })
    }

    // Mock attendance data
    const attendanceRecords = [
      { date: new Date(), status: "Present", time: "08:15 AM" },
      { date: new Date(Date.now() - 24 * 60 * 60 * 1000), status: "Present", time: "08:12 AM" },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: "Present", time: "08:20 AM" },
      { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: "Absent", time: "N/A" },
      { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), status: "Present", time: "08:18 AM" }
    ]

    res.json({
      attendance: 95,
      records: attendanceRecords,
      summary: {
        present: 19,
        absent: 1,
        total: 20
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get child's current trip status
router.get("/child-trip-status", auth, async (req, res) => {
  try {
    const parent = await User.findById(req.user.id)
    if (!parent || parent.role !== 'parent') {
      return res.status(403).json({ error: "Access denied" })
    }

    // Find active trip for child (mock implementation)
    const activeTrip = await Trip.findOne({ status: 'in-progress' })
      .populate('vehicle', 'registrationNumber gpsLocation')
      .populate('route', 'name stops')

    if (activeTrip) {
      res.json({
        tripId: activeTrip._id,
        busNumber: activeTrip.vehicle?.registrationNumber || "B-42",
        currentLocation: "Main Street Junction",
        eta: "8 mins",
        status: "On Route",
        route: activeTrip.route?.name || "Route-A",
        gpsLocation: activeTrip.vehicle?.gpsLocation
      })
    } else {
      res.json({
        tripId: null,
        busNumber: "B-42",
        currentLocation: "Not Started",
        eta: "N/A",
        status: "Scheduled",
        route: "Route-A",
        gpsLocation: null
      })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router