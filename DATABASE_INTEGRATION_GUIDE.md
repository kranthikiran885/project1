# Database Integration Guide

## Overview
This guide explains how to set up and use the real database integration for the College Transport Management System (CTMS). All mock data has been replaced with real MongoDB database services.

## Prerequisites
- MongoDB installed locally or MongoDB Atlas account
- Node.js and npm/pnpm installed
- Backend and frontend dependencies installed

## Setup Instructions

### 1. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Start MongoDB service
mongod --dbpath /path/to/your/data/directory
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get connection string from "Connect" button
4. Replace `<password>` and `<dbname>` in connection string

### 2. Environment Configuration

Create `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb://localhost:27017/ctms
# OR for Atlas: mongodb+srv://username:password@cluster.mongodb.net/ctms

JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies (if not already installed)
cd ../
npm install
```

### 4. Seed Database with Sample Data

```bash
# From the backend directory
cd backend
npm run seed
```

This will create:
- **4 Users**: Admin, Driver, Student, Parent with different roles
- **2 Routes**: North Campus and South Campus routes with stops
- **2 Vehicles**: Active buses with GPS locations and fuel data
- **Sample Payments**: Transaction history
- **Sample Trips**: Active and completed trips

### 5. Start the Application

```bash
# Terminal 1: Start Backend Server
cd backend
npm run dev

# Terminal 2: Start Frontend (from root directory)
npm run dev
```

## Database Models

### User Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  role: String (admin|driver|student|parent),
  name: String,
  phone: String,
  
  // Role-specific fields
  rollNumber: String,        // Student
  collegeName: String,       // Student
  childName: String,         // Parent
  childCollege: String,      // Parent
  licenseNumber: String,     // Driver
  vehicleNumber: String,     // Driver
  employeeId: String,        // Admin
  department: String,        // Admin
  
  // System fields
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Vehicle Model
```javascript
{
  registrationNumber: String (unique),
  capacity: Number,
  model: String,
  fuelType: String,
  color: String,
  status: String (active|maintenance|inactive),
  currentOccupancy: Number,
  fuel: Number (0-100),
  gpsLocation: { lat: Number, lng: Number, updatedAt: Date },
  speed: Number,
  route: ObjectId (ref: Route),
  driver: ObjectId (ref: User)
}
```

### Route Model
```javascript
{
  name: String,
  stops: [{
    name: String,
    latitude: Number,
    longitude: Number,
    sequence: Number,
    estimatedTime: Number
  }],
  distance: Number,
  estimatedDuration: Number,
  scheduleAM: { startTime: String, endTime: String },
  schedulePM: { startTime: String, endTime: String },
  fare: Number,
  vehicles: [ObjectId] (ref: Vehicle),
  students: [ObjectId] (ref: User)
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Dashboard
- `GET /api/dashboard/stats` - Real-time dashboard statistics
- `GET /api/dashboard/analytics` - Analytics data with period filter
- `GET /api/dashboard/realtime-stats` - Live tracking data

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get specific vehicle
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle
- `PUT /api/vehicles/:id/location` - Update GPS location

### Routes
- `GET /api/routes` - Get all routes
- `POST /api/routes` - Create new route
- `PUT /api/routes/:id` - Update route
- `POST /api/routes/:id/optimize` - Optimize route

### Trips
- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create new trip
- `PUT /api/trips/:id/start` - Start trip
- `PUT /api/trips/:id/end` - End trip

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create payment
- `GET /api/payments/history` - Payment history

## Real-time Features

### Socket.IO Integration
The system uses Socket.IO for real-time updates:

```javascript
// Driver location updates
socket.emit('driver_location', { lat, lng, vehicleId })

// Student boarding events
socket.emit('student_boarding', { studentId, tripId })

// Emergency alerts
socket.emit('emergency_sos', { userId, location, message })
```

### Auto-refresh Components
Components automatically refresh data:
- Dashboard stats: Every 30 seconds
- Vehicle locations: Every 10 seconds
- Analytics: On period change

## Login Credentials

After seeding, use these credentials:

```
Admin: admin@ctms.com / admin123
Driver: john.driver@ctms.com / driver123
Student: alice.student@college.edu / student123
Parent: bob.parent@gmail.com / parent123
```

## Data Flow

1. **Registration**: Users register through signup form → Data saved to MongoDB
2. **Authentication**: JWT tokens for secure API access
3. **Dashboard**: Real-time stats fetched from database
4. **Vehicle Management**: CRUD operations on vehicle collection
5. **Analytics**: Aggregated data from trips, payments, routes
6. **Real-time Updates**: Socket.IO for live tracking and notifications

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   - Ensure MongoDB is running
   - Check connection string in .env file

2. **JWT Token Error**
   ```
   Error: jwt malformed
   ```
   - Clear localStorage in browser
   - Re-login to get new token

3. **CORS Error**
   ```
   Access to fetch blocked by CORS policy
   ```
   - Ensure backend is running on port 5000
   - Check FRONTEND_URL in .env

4. **Empty Dashboard**
   - Run `npm run seed` to populate sample data
   - Check MongoDB connection and data

### Database Reset
To reset and reseed database:
```bash
cd backend
npm run seed
```

## Production Deployment

### Environment Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ctms_prod
JWT_SECRET=production_secret_key_very_long_and_secure
PORT=5000
FRONTEND_URL=https://your-domain.com
NODE_ENV=production
```

### Security Considerations
- Use strong JWT secrets
- Enable MongoDB authentication
- Use HTTPS in production
- Implement rate limiting
- Validate all inputs
- Use environment variables for sensitive data

## Monitoring

### Database Monitoring
- Monitor connection pool size
- Track query performance
- Set up alerts for failed connections

### Application Monitoring
- Log API response times
- Monitor memory usage
- Track user activity

## Backup Strategy

### Automated Backups
```bash
# Daily backup script
mongodump --uri="mongodb://localhost:27017/ctms" --out="/backup/$(date +%Y%m%d)"
```

### Data Recovery
```bash
# Restore from backup
mongorestore --uri="mongodb://localhost:27017/ctms" /backup/20240315/ctms
```

## Performance Optimization

### Database Indexing
```javascript
// Add indexes for better performance
db.users.createIndex({ email: 1 })
db.vehicles.createIndex({ registrationNumber: 1 })
db.trips.createIndex({ createdAt: -1 })
```

### Caching Strategy
- Implement Redis for session storage
- Cache frequently accessed data
- Use CDN for static assets

This integration provides a complete, production-ready database solution for the CTMS application with real-time capabilities and comprehensive data management.