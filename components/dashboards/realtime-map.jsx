"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Navigation, RefreshCw } from "lucide-react"
import { dataService } from "../../lib/data-service"

export default function RealtimeMap({ fullScreen = false }) {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const result = await dataService.getVehicles()
        if (result.success) {
          const activeVehicles = result.data.filter(v => v.status === 'active' && v.gpsLocation)
          setVehicles(activeVehicles)
          setLastUpdate(new Date())
        }
      } catch (err) {
        console.error('Failed to fetch vehicles:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
    
    // Update every 10 seconds for real-time tracking
    const interval = setInterval(fetchVehicles, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`${fullScreen ? "h-screen" : "h-96"} bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl overflow-hidden relative backdrop-blur-xl`}
    >
      {/* Animated map background with grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10">
        <svg className="w-full h-full opacity-5" viewBox="0 0 400 300">
          {/* Grid lines */}
          {[...Array(10)].map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 30} x2="400" y2={i * 30} stroke="currentColor" strokeWidth="0.5" />
          ))}
          {[...Array(13)].map((_, i) => (
            <line key={`v-${i}`} x1={i * 31} y1="0" x2={i * 31} y2="300" stroke="currentColor" strokeWidth="0.5" />
          ))}
        </svg>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-slate-800/80 backdrop-blur border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading vehicle positions...</span>
            </div>
          </div>
        </div>
      )}

      {/* Real-time vehicles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {vehicles.map((vehicle, idx) => (
          <motion.div
            key={vehicle._id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.2, duration: 0.5 }}
            className="absolute"
            style={{
              left: `${20 + idx * 25}%`,
              top: `${30 + idx * 15}%`,
            }}
          >
            {/* Animated pulse ring */}
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="absolute -inset-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-xl opacity-30"
            />

            {/* Bus marker */}
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="relative z-10 bg-gradient-to-br from-orange-500 to-pink-500 text-white p-3 rounded-lg shadow-lg cursor-pointer hover:shadow-orange-500/50 transition-all"
            >
              <Navigation className="w-6 h-6" />
            </motion.div>

            {/* Info tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute top-14 left-0 bg-slate-800/90 border border-purple-500/50 rounded-lg p-3 whitespace-nowrap text-xs z-20 opacity-0 pointer-events-none backdrop-blur-xl"
            >
              <p className="font-bold text-white">{vehicle.registrationNumber}</p>
              <p className="text-gray-400">{vehicle.currentOccupancy || 0}/{vehicle.capacity} passengers</p>
              <p className="text-orange-400 text-xs">⛽ {vehicle.fuel || 0}%</p>
              <p className="text-cyan-400 text-xs mt-1">● Live GPS: {vehicle.speed || 0} km/h</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur border border-purple-500/30 rounded-lg p-4 text-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full shadow-lg" />
            <span className="text-gray-300">Active Bus</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span className="text-gray-400">Real-time GPS</span>
          </div>
        </div>
      </div>

      {/* Top Right Info */}
      <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur border border-purple-500/30 rounded-lg p-4 text-xs">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-400 font-semibold">Active Fleet ({vehicles.length})</p>
          <p className="text-gray-500 text-xs">Updated: {lastUpdate.toLocaleTimeString()}</p>
        </div>
        <div className="space-y-1">
          {vehicles.slice(0, 3).map((vehicle) => (
            <div key={vehicle._id} className="flex items-center justify-between gap-4 text-gray-300">
              <span className="text-xs">{vehicle.registrationNumber}</span>
              <span className="text-cyan-400 font-semibold text-xs">{vehicle.currentOccupancy || 0}👥</span>
            </div>
          ))}
          {vehicles.length === 0 && !loading && (
            <p className="text-gray-500 text-xs">No active vehicles</p>
          )}
        </div>
      </div>
    </div>
  )
}
