"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext()

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    })

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id)
      setConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected')
      setConnected(false)
    })

    // Listen for real-time events
    socketInstance.on('location_update', (data) => {
      console.log('Location update:', data)
      addNotification({
        id: Date.now(),
        type: 'info',
        title: 'Location Update',
        message: `Vehicle location updated`,
        timestamp: new Date()
      })
    })

    socketInstance.on('student_boarded', (data) => {
      console.log('Student boarded:', data)
      addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Student Boarded',
        message: `${data.name || 'Student'} has boarded the bus`,
        timestamp: new Date()
      })
    })

    socketInstance.on('emergency_alert', (data) => {
      console.log('Emergency alert:', data)
      addNotification({
        id: Date.now(),
        type: 'alert',
        title: 'Emergency Alert',
        message: data.description || 'Emergency situation reported',
        timestamp: new Date()
      })
    })

    socketInstance.on('trip_update', (data) => {
      console.log('Trip update:', data)
      addNotification({
        id: Date.now(),
        type: 'info',
        title: 'Trip Update',
        message: `Trip status: ${data.status}`,
        timestamp: new Date()
      })
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Keep only 10 notifications
  }

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const emitLocationUpdate = (locationData) => {
    if (socket && connected) {
      socket.emit('driver_location', locationData)
    }
  }

  const emitStudentBoarding = (studentData) => {
    if (socket && connected) {
      socket.emit('student_boarding', studentData)
    }
  }

  const emitEmergencySOS = (alertData) => {
    if (socket && connected) {
      socket.emit('emergency_sos', alertData)
    }
  }

  const emitTripStart = (tripData) => {
    if (socket && connected) {
      socket.emit('trip_started', tripData)
    }
  }

  const emitTripEnd = (tripData) => {
    if (socket && connected) {
      socket.emit('trip_ended', tripData)
    }
  }

  const value = {
    socket,
    connected,
    notifications,
    addNotification,
    clearNotification,
    clearAllNotifications,
    emitLocationUpdate,
    emitStudentBoarding,
    emitEmergencySOS,
    emitTripStart,
    emitTripEnd,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

// Default export for backward compatibility
export default function SocketIntegration({ children }) {
  return <SocketProvider>{children}</SocketProvider>
}