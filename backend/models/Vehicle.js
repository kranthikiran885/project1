const mongoose = require("mongoose")

const vehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, unique: true, required: true },
  capacity: { type: Number, required: true },
  model: String,
  fuelType: { type: String, enum: ["petrol", "diesel", "electric", "hybrid"], default: "diesel" },
  color: String,
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["active", "maintenance", "inactive"], default: "active" },
  currentOccupancy: { type: Number, default: 0 },
  gpsLocation: { lat: Number, lng: Number, updatedAt: Date },
  speed: Number,
  fuel: { type: Number, min: 0, max: 100 },
  mileage: Number,
  lastServiceDate: Date,
  nextServiceDate: Date,
  insuranceExpiry: Date,
  documents: {
    rc: String,
    insurance: String,
    pollution: String,
  },
  maintenanceHistory: [
    {
      date: Date,
      type: String,
      cost: Number,
      description: String,
      mechanic: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Vehicle", vehicleSchema)
