// College Transport Management System - Backend
const express = require("express")
const mongoose = require("mongoose")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
require("dotenv").config()

const app = express()
const server = http.createServer(app)

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  maxHttpBufferSize: 1e6,
})

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

// MongoDB Connection with better error handling
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/ctms"
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("[v0] MongoDB connected successfully"))
  .catch((err) => {
    console.warn("[v0] MongoDB connection failed:", err.message)
    console.warn("[v0] Server will continue without database connection")
  })

// Model imports
const User = require("./models/User")
const Vehicle = require("./models/Vehicle")
const Trip = require("./models/Trip")
const Route = require("./models/Route")
const Payment = require("./models/Payment")
const EmergencyAlert = require("./models/EmergencyAlert")

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/vehicles", require("./routes/vehicles"))
app.use("/api/trips", require("./routes/trips"))
app.use("/api/payments", require("./routes/payments"))
app.use("/api/routes", require("./routes/routes"))
app.use("/api/emergency", require("./routes/emergency"))
app.use("/api/admin", require("./routes/admin"))
app.use("/api/dashboard", require("./routes/dashboard"))
app.use("/api/parent", require("./routes/parent"))

// Socket.IO - Real-time Updates
io.on("connection", (socket) => {
  console.log("[v0] User connected:", socket.id)

  // Driver location tracking
  socket.on("driver_location", (data) => {
    io.emit("location_update", { driverId: socket.id, ...data })
  })

  // Student boarding events
  socket.on("student_boarding", (data) => {
    io.emit("student_boarded", { timestamp: new Date(), ...data })
  })

  // Emergency SOS
  socket.on("emergency_sos", (data) => {
    io.emit("emergency_alert", {
      type: "SOS",
      severity: "critical",
      timestamp: new Date(),
      ...data,
    })
  })

  // Trip lifecycle
  socket.on("trip_started", (data) => {
    io.emit("trip_update", { status: "in-progress", ...data })
  })

  socket.on("trip_ended", (data) => {
    io.emit("trip_update", { status: "completed", ...data })
  })

  // Disconnect
  socket.on("disconnect", () => {
    console.log("[v0] User disconnected:", socket.id)
    io.emit("user_offline", { userId: socket.id })
  })
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  })
})

app.use((err, req, res, next) => {
  console.error("[v0] Error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    timestamp: new Date(),
  })
})

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`[v0] CTMS Server running on port ${PORT}`)
  console.log(`[v0] Socket.IO server ready for connections`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[v0] SIGTERM received, shutting down gracefully")
  server.close(() => {
    console.log("[v0] Server closed")
    mongoose.connection.close()
  })
})

module.exports = { app, io }
