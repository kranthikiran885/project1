"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Radio, Eye, EyeOff } from "lucide-react"

export default function RealtimeTrackingAdvanced() {
  const [buses, setBuses] = useState([
    { id: 1, lat: 28.5355, lng: 77.391, name: "Route-A1", students: 42, status: "active", speed: 35 },
    { id: 2, lat: 28.536, lng: 77.395, name: "Route-B2", students: 38, status: "active", speed: 42 },
    { id: 3, lat: 28.535, lng: 77.387, name: "Route-C3", students: 35, status: "active", speed: 28 },
  ])

  const [selectedBus, setSelectedBus] = useState(buses[0])
  const [showHeatmap, setShowHeatmap] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => ({
          ...bus,
          lat: bus.lat + (Math.random() - 0.5) * 0.001,
          lng: bus.lng + (Math.random() - 0.5) * 0.001,
          speed: Math.max(20, Math.min(55, bus.speed + (Math.random() - 0.5) * 5)),
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const updated = buses.find((b) => b.id === selectedBus.id)
    if (updated) setSelectedBus(updated)
  }, [buses])

  return (
    <div className="space-y-6">
      {/* Live GPS Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="w-3 h-3 bg-chart-5 rounded-full glow-primary"
          />
          <h3 className="text-lg font-bold text-foreground">Live GPS Tracking</h3>
          <span className="ml-auto text-xs text-muted-foreground">Updating every 2s</span>
        </div>

        {/* Map Simulation */}
        <div className="h-96 bg-gradient-to-br from-secondary/5 to-primary/5 border border-border rounded-lg overflow-hidden relative mb-4">
          {/* Grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 400 300">
            {[...Array(10)].map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 30} x2="400" y2={i * 30} stroke="currentColor" strokeWidth="1" />
            ))}
            {[...Array(13)].map((_, i) => (
              <line key={`v-${i}`} x1={i * 31} y1="0" x2={i * 31} y2="300" stroke="currentColor" strokeWidth="1" />
            ))}
          </svg>

          {/* Heatmap layer */}
          {showHeatmap && (
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                <defs>
                  <radialGradient id="heatmap1">
                    <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="80" cy="90" r="40" fill="url(#heatmap1)" />
                <circle cx="200" cy="150" r="50" fill="url(#heatmap1)" />
                <circle cx="320" cy="80" r="35" fill="url(#heatmap1)" />
              </svg>
            </div>
          )}

          {/* Real-time buses */}
          <div className="absolute inset-0">
            {buses.map((bus, idx) => (
              <motion.div
                key={bus.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="absolute"
                style={{
                  left: `${20 + (bus.lng - 77.387) * 1000}px`,
                  top: `${30 + (bus.lat - 28.5355) * 1000}px`,
                  cursor: "pointer",
                }}
                onClick={() => setSelectedBus(bus)}
              >
                <motion.div
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -inset-8 bg-primary/20 rounded-full blur-lg"
                />
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`relative z-10 text-white p-2 rounded-lg font-bold text-sm flex items-center justify-center w-12 h-12 ${
                    selectedBus.id === bus.id ? "bg-primary glow-primary" : "bg-accent"
                  }`}
                >
                  🚌
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="absolute top-4 right-4 bg-card/80 backdrop-blur border border-border rounded-lg p-2 text-foreground hover:bg-primary/20 transition-all"
          >
            {showHeatmap ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span>Selected Bus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span>Active Bus</span>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="w-3 h-3 text-chart-5" />
            <span>GPS Signal</span>
          </div>
        </div>
      </motion.div>

      {/* Selected Bus Details */}
      {selectedBus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">{selectedBus.name} - Live Details</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-sidebar rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Coordinates</p>
              <p className="font-mono text-sm text-accent">
                {selectedBus.lat.toFixed(4)}, {selectedBus.lng.toFixed(4)}
              </p>
            </div>

            <div className="bg-sidebar rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Current Speed</p>
              <motion.p
                animate={{ color: selectedBus.speed > 45 ? "#ff6b35" : "#00d4ff" }}
                className="font-bold text-lg"
              >
                {selectedBus.speed.toFixed(1)} km/h
              </motion.p>
            </div>

            <div className="bg-sidebar rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Students Onboard</p>
              <p className="font-bold text-lg text-chart-5">{selectedBus.students}/45</p>
            </div>

            <div className="bg-sidebar rounded-lg p-4">
              <p className="text-muted-foreground text-xs mb-1">Signal Strength</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-1 h-3 rounded-full ${i <= 4 ? "bg-chart-5" : "bg-muted"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Route trace */}
          <div className="bg-sidebar rounded-lg p-4">
            <p className="text-muted-foreground text-xs mb-2">Route Trace</p>
            <svg className="w-full h-20" viewBox="0 0 400 80">
              <polyline
                points="0,40 50,35 100,45 150,30 200,50 250,25 300,40 350,35 400,45"
                fill="none"
                stroke="#00d4ff"
                strokeWidth="2"
              />
              <circle cx="400" cy="45" r="4" fill="#ff6b35" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* All Buses List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="text-lg font-bold text-foreground mb-4">Connected Buses</h3>
        <div className="space-y-2">
          {buses.map((bus) => (
            <motion.button
              key={bus.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedBus(bus)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                selectedBus.id === bus.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground">{bus.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {bus.students} students • {bus.speed.toFixed(0)} km/h
                  </p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  className="w-2 h-2 bg-chart-5 rounded-full glow-primary"
                />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
