"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings2 } from "lucide-react"

export default function AdvancedRealtimeMap() {
  const [buses, setBuses] = useState([
    { id: 1, name: "BUS-001", lat: 150, lng: 80, speed: 45, route: "A1", occupancy: 85, status: "moving" },
    { id: 2, name: "BUS-002", lat: 220, lng: 60, speed: 32, route: "A2", occupancy: 62, status: "moving" },
    { id: 3, name: "BUS-003", lat: 100, lng: 150, speed: 0, route: "B1", occupancy: 95, status: "stopped" },
  ])

  const [selectedBus, setSelectedBus] = useState(null)
  const [heatmapMode, setHeatmapMode] = useState(false)
  const [animatedBuses, setAnimatedBuses] = useState(buses.map((b) => ({ ...b })))

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedBuses((prev) =>
        prev.map((bus) => ({
          ...bus,
          lat: bus.status === "moving" ? bus.lat + (Math.random() - 0.5) * 20 : bus.lat,
          lng: bus.status === "moving" ? bus.lng + (Math.random() - 0.5) * 20 : bus.lng,
          speed: bus.status === "moving" ? 30 + Math.random() * 40 : 0,
          occupancy: Math.min(100, Math.max(50, bus.occupancy + (Math.random() - 0.5) * 5)),
        })),
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Live Fleet Map</h2>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setHeatmapMode(!heatmapMode)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              heatmapMode
                ? "bg-primary text-primary-foreground glow-primary"
                : "bg-sidebar text-foreground border border-border"
            }`}
          >
            Heatmap
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-sidebar text-accent rounded-lg font-semibold hover:bg-sidebar/80"
          >
            <Settings2 className="w-4 h-4 inline mr-2" />
            Options
          </motion.button>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative w-full h-96 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/30 rounded-xl overflow-hidden mb-6">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2a2a3e" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#grid)" />

          {/* Heatmap layer */}
          {heatmapMode && (
            <>
              <circle cx="150" cy="80" r="40" fill="#ff6b35" opacity="0.2" />
              <circle cx="220" cy="60" r="35" fill="#00d4ff" opacity="0.15" />
              <circle cx="100" cy="150" r="50" fill="#a100f2" opacity="0.1" />
            </>
          )}

          {/* Route lines */}
          <polyline points="50,200 150,100 250,80 350,50" fill="none" stroke="#00d4ff" strokeWidth="2" opacity="0.3" />
          <polyline
            points="50,100 100,120 200,150 300,200"
            fill="none"
            stroke="#ff6b35"
            strokeWidth="2"
            opacity="0.3"
          />

          {/* Bus markers */}
          {animatedBuses.map((bus, idx) => (
            <motion.g
              key={bus.id}
              animate={{ x: bus.lat - 150, y: bus.lng - 80 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              onClick={() => setSelectedBus(bus)}
              className="cursor-pointer"
            >
              {/* Bus circle */}
              <motion.circle
                cx="150"
                cy="80"
                r="8"
                fill={bus.status === "moving" ? "#ff6b35" : "#00d4ff"}
                animate={{ r: selectedBus?.id === bus.id ? 12 : 8 }}
              />
              {/* Pulse effect */}
              <motion.circle
                cx="150"
                cy="80"
                r="8"
                fill="none"
                stroke={bus.status === "moving" ? "#ff6b35" : "#00d4ff"}
                strokeWidth="1"
                opacity="0.5"
                animate={{ r: [8, 16], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              {/* Label */}
              <text x="150" y="95" textAnchor="middle" fill="#e8e8f0" fontSize="10">
                {bus.name}
              </text>
            </motion.g>
          ))}

          {/* Destination markers */}
          <circle cx="350" cy="50" r="6" fill="#00ffa3" opacity="0.6" />
          <text x="350" y="75" textAnchor="middle" fill="#00ffa3" fontSize="9">
            Destination
          </text>
        </svg>
      </div>

      {/* Bus Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {animatedBuses.map((bus, idx) => (
          <motion.div
            key={bus.id}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedBus(bus)}
            className={`bg-gradient-to-br rounded-lg p-4 cursor-pointer transition-all border ${
              selectedBus?.id === bus.id
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50 bg-sidebar/50"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-foreground">{bus.name}</p>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                className={`w-3 h-3 rounded-full ${bus.status === "moving" ? "bg-chart-5" : "bg-muted"}`}
              />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route:</span>
                <span className="text-accent font-semibold">{bus.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Speed:</span>
                <span className="text-chart-5 font-semibold">{Math.round(bus.speed)} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Occupancy:</span>
                <span className="text-primary font-semibold">{Math.round(bus.occupancy)}%</span>
              </div>
              <div className="w-full bg-background/30 rounded-full h-2 mt-2">
                <motion.div
                  animate={{ width: `${bus.occupancy}%` }}
                  transition={{ duration: 1 }}
                  className="bg-gradient-to-r from-primary to-accent h-full rounded-full"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Bus Details */}
      {selectedBus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-lg p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Bus ID</p>
              <p className="text-lg font-bold text-foreground">{selectedBus.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Route</p>
              <p className="text-lg font-bold text-accent">{selectedBus.route}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Speed</p>
              <p className="text-lg font-bold text-chart-5">{Math.round(selectedBus.speed)} km/h</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-lg font-bold text-chart-3 capitalize">{selectedBus.status}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
