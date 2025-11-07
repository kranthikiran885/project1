const mongoose = require("mongoose")

const emergencyAlertSchema = new mongoose.Schema({
  type: { type: String, enum: ["SOS", "accident", "breakdown", "medical"], required: true },
  initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  location: { lat: Number, lng: Number },
  description: String,
  images: [String],
  severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "high" },
  status: { type: String, enum: ["active", "resolved", "cancelled"], default: "active" },
  respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resolutionTime: Number,
  notifiedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("EmergencyAlert", emergencyAlertSchema)
