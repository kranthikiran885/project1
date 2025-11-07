const mongoose = require("mongoose")

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  stops: [
    {
      name: String,
      latitude: Number,
      longitude: Number,
      sequence: Number,
      estimatedTime: Number,
    },
  ],
  distance: Number,
  estimatedDuration: Number,
  frequency: { type: String, enum: ["daily", "weekdays", "weekends", "custom"], default: "daily" },
  vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  scheduleAM: { startTime: String, endTime: String },
  schedulePM: { startTime: String, endTime: String },
  fare: Number,
  optimization: {
    efficiency: { type: Number, min: 0, max: 100 },
    delayAverage: Number,
    lastOptimizedAt: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Route", routeSchema)
