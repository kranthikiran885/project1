"use client"

import { useEffect, useState } from "react"
import NotificationCenter from "./notification-center"

export default function SocketListener({ children }) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Simulate receiving various real-time events
    const events = [
      {
        id: 1,
        type: "success",
        title: "Bus Arrival",
        message: "BUS-001 arrived at pickup location",
        description: "ETA: Now",
      },
      {
        id: 2,
        type: "warning",
        title: "Route Delay",
        message: "Route B2 experiencing 5-minute delay",
        description: "Traffic update",
      },
      { id: 3, type: "info", title: "Student Boarded", message: "John Doe boarded BUS-001", description: "Seat: C-12" },
      {
        id: 4,
        type: "success",
        title: "Trip Completed",
        message: "Route A1 trip completed successfully",
        description: "All students dropped",
      },
    ]

    let eventIndex = 0
    const interval = setInterval(() => {
      if (notifications.length < 3) {
        const event = events[eventIndex % events.length]
        setNotifications((prev) => [event, ...prev])
        eventIndex++
      }
    }, 6000)

    // Auto-remove notifications after 6 seconds
    const removeInterval = setInterval(() => {
      setNotifications((prev) => prev.slice(0, -1))
    }, 6000)

    return () => {
      clearInterval(interval)
      clearInterval(removeInterval)
    }
  }, [])

  return (
    <>
      <NotificationCenter notifications={notifications} />
      {children}
    </>
  )
}
