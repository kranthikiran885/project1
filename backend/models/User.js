const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "driver", "student", "parent", "accountant", "mechanic"],
    required: true,
  },
  name: { type: String, required: true },
  phone: String,
  profilePhoto: String,
  
  // Student specific fields
  rollNumber: String,
  collegeName: String,
  
  // Parent specific fields
  childName: String,
  childCollege: String,
  
  // Driver specific fields
  licenseNumber: String,
  vehicleNumber: String,
  
  // Admin specific fields
  employeeId: String,
  department: String,
  
  // General fields
  parentEmail: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
  assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  darkMode: { type: Boolean, default: true },
  notifications: { type: Boolean, default: true },
  biometricEnabled: { type: Boolean, default: false },
  lastLogin: Date,
  activityLogs: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now },
      details: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password)
}

module.exports = mongoose.model("User", userSchema)
