"use client"

import { useState, useEffect } from 'react'
import { apiService } from '@/lib/api-service'
import { authService } from '@/lib/auth-service'

export function useRealTimeData() {
  const [vehicles, setVehicles] = useState([])
  const [trips, setTrips] = useState([])
  const [routes, setRoutes] = useState([])
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!authService.isAuthenticated()) return

      try {
        setLoading(true)
        const [vehiclesRes, tripsRes, routesRes, statsRes] = await Promise.all([
          apiService.getVehicles(),
          apiService.getTrips(),
          apiService.getRoutes(),
          apiService.getDashboardStats(),
        ])

        if (vehiclesRes.success) setVehicles(vehiclesRes.data)
        if (tripsRes.success) setTrips(tripsRes.data)
        if (routesRes.success) setRoutes(routesRes.data)
        if (statsRes.success) setDashboardStats(statsRes.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!authService.isAuthenticated()) return

      try {
        const [vehiclesRes, statsRes] = await Promise.all([
          apiService.getVehicles(),
          apiService.getDashboardStats(),
        ])

        if (vehiclesRes.success) setVehicles(vehiclesRes.data)
        if (statsRes.success) setDashboardStats(statsRes.data)
      } catch (err) {
        console.error('Real-time update failed:', err)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const updateVehicleLocation = async (vehicleId, locationData) => {
    try {
      const result = await apiService.updateVehicleLocation(vehicleId, locationData)
      if (result.success) {
        setVehicles(prev => prev.map(v => v._id === vehicleId ? result.data : v))
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const startTrip = async (tripId) => {
    try {
      const result = await apiService.startTrip(tripId)
      if (result.success) {
        setTrips(prev => prev.map(t => t._id === tripId ? result.data.trip : t))
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const endTrip = async (tripId) => {
    try {
      const result = await apiService.endTrip(tripId)
      if (result.success) {
        setTrips(prev => prev.map(t => t._id === tripId ? result.data.trip : t))
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const boardStudent = async (tripId, studentData) => {
    try {
      const result = await apiService.boardStudent(tripId, studentData)
      if (result.success) {
        setTrips(prev => prev.map(t => t._id === tripId ? result.data.trip : t))
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const createEmergencyAlert = async (alertData) => {
    try {
      const result = await apiService.createEmergencyAlert(alertData)
      return result
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    vehicles,
    trips,
    routes,
    dashboardStats,
    loading,
    error,
    updateVehicleLocation,
    startTrip,
    endTrip,
    boardStudent,
    createEmergencyAlert,
  }
}