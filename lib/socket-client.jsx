"use client"

import { useEffect, useState, useRef } from "react"

// Simulated Socket.IO client for real-time features
export const useSocket = () => {
  const [connected, setConnected] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [liveTracking, setLiveTracking] = useState([])
  const socketRef = useRef(null)

  useEffect(() => {
    // Simulate socket connection
    setConnected(true)

    // Simulate real-time bus tracking updates
    const trackingInterval = setInterval(() => {
      setLiveTracking((buses) =>
        buses.map((bus) => ({
          ...bus,
          lat: bus.lat + (Math.random() - 0.5) * 0.001,
          lng: bus.lng + (Math.random() - 0.5) * 0.001,
        })),
      )
    }, 3000)

    // Simulate incoming notifications
    const notificationInterval = setInterval(() => {
      const messages = [
        { id: Date.now(), type: "arrival", message: "Bus BUS-001 arrived at Stop-A", timestamp: new Date() },
        { id: Date.now() + 1, type: "delay", message: "Route B2 delayed by 5 minutes", timestamp: new Date() },
        { id: Date.now() + 2, type: "boarding", message: "Student John Doe boarded BUS-001", timestamp: new Date() },
      ]
      const randomMsg = messages[Math.floor(Math.random() * messages.length)]
      setNotifications((prev) => [randomMsg, ...prev.slice(0, 9)])
    }, 8000)

    return () => {
      clearInterval(trackingInterval)
      clearInterval(notificationInterval)
    }
  }, [])

  const emitEvent = (event, data) => {
    console.log("[Socket] Emitting:", event, data)
  }

  const onEvent = (event, callback) => {
    console.log("[Socket] Listening to:", event)
  }

  return {
    connected,
    notifications,
    liveTracking,
    emitEvent,
    onEvent,
  }
}

// Real-time GPS tracking for buses
export const useBusTracking = (busId) => {
  const [position, setPosition] = useState({ lat: 28.5355, lng: 77.391, timestamp: Date.now() })

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.002,
        lng: prev.lng + (Math.random() - 0.5) * 0.002,
        timestamp: Date.now(),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [busId])

  return position
}

// Real-time ETA calculation
export const useETACalculation = (busId, destinationLat, destinationLng) => {
  const [eta, setEta] = useState(null)
  const [distance, setDistance] = useState(null)

  useEffect(() => {
    const calculateETA = () => {
      // Haversine formula for distance
      const R = 6371 // Earth's radius in km
      const dLat = (destinationLat - 28.5355) * (Math.PI / 180)
      const dLng = (destinationLng - 77.391) * (Math.PI / 180)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(28.5355 * (Math.PI / 180)) *
          Math.cos(destinationLat * (Math.PI / 180)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const dist = R * c

      const avgSpeed = 40 // km/h average
      const timeMinutes = Math.round((dist / avgSpeed) * 60)

      setDistance(dist.toFixed(1))
      setEta(timeMinutes)
    }

    calculateETA()
    const interval = setInterval(calculateETA, 10000)
    return () => clearInterval(interval)
  }, [busId, destinationLat, destinationLng])

  return { eta, distance }
}
