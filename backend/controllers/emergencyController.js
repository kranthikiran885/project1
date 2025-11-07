const EmergencyAlert = require("../models/EmergencyAlert")
const User = require("../models/User")
const Trip = require("../models/Trip")

exports.createEmergencyAlert = async (req, res) => {
  try {
    const { type, trip, vehicle, location, description, images, severity } = req.body

    const alert = new EmergencyAlert({
      type,
      initiatedBy: req.user.id,
      trip,
      vehicle,
      location,
      description,
      images,
      severity: severity || "high",
      status: "active",
    })

    await alert.save()
    res.status(201).json({ message: "Emergency alert created", alert })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getEmergencyAlerts = async (req, res) => {
  try {
    const alerts = await EmergencyAlert.find().populate("initiatedBy respondedBy trip vehicle").sort({ createdAt: -1 })
    res.json(alerts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getAlertById = async (req, res) => {
  try {
    const alert = await EmergencyAlert.findById(req.params.id).populate("initiatedBy respondedBy trip vehicle")
    if (!alert) return res.status(404).json({ error: "Alert not found" })
    res.json(alert)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.resolveAlert = async (req, res) => {
  try {
    const { resolution } = req.body
    const alert = await EmergencyAlert.findById(req.params.id)

    const updatedAlert = await EmergencyAlert.findByIdAndUpdate(
      req.params.id,
      {
        status: "resolved",
        respondedBy: req.user.id,
        resolutionTime: new Date() - alert.createdAt,
        updatedAt: new Date(),
      },
      { new: true },
    )

    res.json({ message: "Alert resolved", alert: updatedAlert })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.notifyUsers = async (req, res) => {
  try {
    const { userIds } = req.body
    const alert = await EmergencyAlert.findById(req.params.id)

    alert.notifiedUsers = userIds
    await alert.save()

    res.json({ message: "Users notified", notifiedCount: userIds.length })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
