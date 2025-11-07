const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Import models
const User = require('../models/User')
const Vehicle = require('../models/Vehicle')
const Route = require('../models/Route')
const Trip = require('../models/Trip')
const Payment = require('../models/Payment')
const EmergencyAlert = require('../models/EmergencyAlert')

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ctms'

async function seedDatabase() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Connected to MongoDB')

    // Clear existing data
    await User.deleteMany({})
    await Vehicle.deleteMany({})
    await Route.deleteMany({})
    await Trip.deleteMany({})
    await Payment.deleteMany({})
    await EmergencyAlert.deleteMany({})

    console.log('Cleared existing data')

    // Create sample users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@ctms.com',
        password: 'admin123',
        role: 'admin',
        phone: '1234567890',
        employeeId: 'EMP001',
        department: 'Transport Management'
      },
      {
        name: 'John Driver',
        email: 'driver@ctms.com',
        password: 'driver123',
        role: 'driver',
        phone: '1234567891',
        licenseNumber: 'DL123456789',
        vehicleNumber: 'MH01AB1234'
      },
      {
        name: 'Alice Student',
        email: 'student@ctms.com',
        password: 'student123',
        role: 'student',
        phone: '1234567892',
        rollNumber: 'STU001',
        collegeName: 'Central College'
      },
      {
        name: 'Bob Parent',
        email: 'parent@ctms.com',
        password: 'parent123',
        role: 'parent',
        phone: '1234567893',
        childName: 'Alice Student',
        childCollege: 'Central College'
      }
    ]

    const createdUsers = await User.insertMany(users)
    console.log('Created sample users')

    // Create sample routes
    const routes = [
      {
        name: 'Route A - Central',
        description: 'Main route covering central areas',
        stops: [
          { name: 'Central Station', coordinates: { lat: 28.6139, lng: 77.2090 }, order: 1 },
          { name: 'City Mall', coordinates: { lat: 28.6129, lng: 77.2295 }, order: 2 },
          { name: 'College Gate', coordinates: { lat: 28.6169, lng: 77.2090 }, order: 3 }
        ],
        distance: 15.5,
        estimatedTime: 45,
        isActive: true
      },
      {
        name: 'Route B - North',
        description: 'Northern suburbs route',
        stops: [
          { name: 'North Plaza', coordinates: { lat: 28.7041, lng: 77.1025 }, order: 1 },
          { name: 'Metro Station', coordinates: { lat: 28.6942, lng: 77.1025 }, order: 2 },
          { name: 'College Gate', coordinates: { lat: 28.6169, lng: 77.2090 }, order: 3 }
        ],
        distance: 22.3,
        estimatedTime: 60,
        isActive: true
      }
    ]

    const createdRoutes = await Route.insertMany(routes)
    console.log('Created sample routes')

    // Create sample vehicles
    const vehicles = [
      {
        registrationNumber: 'MH01AB1234',
        capacity: 40,
        model: 'Tata Starbus',
        fuelType: 'diesel',
        color: 'Blue',
        status: 'active',
        driver: createdUsers.find(u => u.role === 'driver')._id,
        route: createdRoutes[0]._id,
        gpsLocation: {
          lat: 28.6139,
          lng: 77.2090,
          updatedAt: new Date()
        },
        fuel: 75,
        speed: 0,
        currentOccupancy: 0
      },
      {
        registrationNumber: 'MH01CD5678',
        capacity: 35,
        model: 'Ashok Leyland',
        fuelType: 'hybrid',
        color: 'Yellow',
        status: 'active',
        route: createdRoutes[1]._id,
        gpsLocation: {
          lat: 28.7041,
          lng: 77.1025,
          updatedAt: new Date()
        },
        fuel: 60,
        speed: 0,
        currentOccupancy: 0
      }
    ]

    const createdVehicles = await Vehicle.insertMany(vehicles)
    console.log('Created sample vehicles')

    // Create sample trips
    const trips = [
      {
        vehicle: createdVehicles[0]._id,
        driver: createdUsers.find(u => u.role === 'driver')._id,
        route: createdRoutes[0]._id,
        tripType: 'pickup',
        status: 'scheduled',
        scheduledStartTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        students: []
      },
      {
        vehicle: createdVehicles[1]._id,
        route: createdRoutes[1]._id,
        tripType: 'drop',
        status: 'completed',
        scheduledStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        actualStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        actualEndTime: new Date(Date.now() - 60 * 60 * 1000),
        students: []
      }
    ]

    const createdTrips = await Trip.insertMany(trips)
    console.log('Created sample trips')

    // Create sample payments
    const payments = [
      {
        user: createdUsers.find(u => u.role === 'student')._id,
        amount: 500,
        type: 'monthly_fee',
        status: 'completed',
        paymentMethod: 'card',
        transactionId: 'TXN001',
        description: 'Monthly transport fee - December 2024'
      },
      {
        user: createdUsers.find(u => u.role === 'parent')._id,
        amount: 500,
        type: 'monthly_fee',
        status: 'pending',
        paymentMethod: 'upi',
        description: 'Monthly transport fee - January 2025'
      }
    ]

    const createdPayments = await Payment.insertMany(payments)
    console.log('Created sample payments')

    // Create sample emergency alerts
    const emergencyAlerts = [
      {
        user: createdUsers.find(u => u.role === 'driver')._id,
        type: 'breakdown',
        severity: 'medium',
        description: 'Vehicle breakdown on Route A',
        location: {
          lat: 28.6139,
          lng: 77.2090,
          address: 'Central Station, Delhi'
        },
        status: 'resolved',
        resolvedAt: new Date(Date.now() - 30 * 60 * 1000),
        resolution: 'Mechanic dispatched and issue resolved'
      }
    ]

    await EmergencyAlert.insertMany(emergencyAlerts)
    console.log('Created sample emergency alerts')

    console.log('Database seeded successfully!')
    console.log('\nSample login credentials:')
    console.log('Admin: admin@ctms.com / admin123')
    console.log('Driver: driver@ctms.com / driver123')
    console.log('Student: student@ctms.com / student123')
    console.log('Parent: parent@ctms.com / parent123')

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase()
}

module.exports = seedDatabase