const mongoose = require("mongoose")

const tripSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  tripType: { type: String, enum: ["morning", "evening", "custom"], default: "morning" },
  scheduledStartTime: Date,
  actualStartTime: Date,
  scheduledEndTime: Date,
  actualEndTime: Date,
  students: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      boarding: Boolean,
      boardingTime: Date,
      boardingOTP: String,
      seatNumber: String,
    },
  ],
  status: { type: String, enum: ["pending", "in-progress", "completed", "cancelled"], default: "pending" },
  stops: [
    {
      stopId: String,
      visitTime: Date,
      studentsBoarded: Number,
      delayMinutes: Number,
    },
  ],
  incidents: [
    {
      type: String,
      description: String,
      timestamp: Date,
      image: String,
    },
  ],
  speedViolations: [{ timestamp: Date, speed: Number, limit: Number }],
  averageSpeed: Number,
  totalDistance: Number,
  fuelConsumed: Number,
  performanceScore: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Trip", tripSchema)
