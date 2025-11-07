const Trip = require("../models/Trip")
const Vehicle = require("../models/Vehicle")

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate("vehicle driver route students")
    res.json(trips)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("vehicle driver route students")
    if (!trip) return res.status(404).json({ error: "Trip not found" })
    res.json(trip)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createTrip = async (req, res) => {
  try {
    const { vehicle, driver, route, tripType, scheduledStartTime } = req.body

    const trip = new Trip({
      vehicle,
      driver,
      route,
      tripType,
      scheduledStartTime,
    })

    await trip.save()
    await trip.populate("vehicle driver route")
    res.status(201).json({ message: "Trip created", trip })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.startTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { status: "in-progress", actualStartTime: new Date() },
      { new: true },
    )
    res.json({ message: "Trip started", trip })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.endTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { status: "completed", actualEndTime: new Date() },
      { new: true },
    )
    res.json({ message: "Trip ended", trip })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.boardStudent = async (req, res) => {
  try {
    const { studentId, seatNumber } = req.body
    const trip = await Trip.findById(req.params.id)

    trip.students.push({ studentId, boarding: true, boardingTime: new Date(), seatNumber })
    await trip.save()

    res.json({ message: "Student boarded", trip })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
