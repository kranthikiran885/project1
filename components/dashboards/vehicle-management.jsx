"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit2, Trash2, Fuel, AlertTriangle, CheckCircle, Zap, Plus, RefreshCw, TrendingUp, MapPin, Users } from "lucide-react"
import { dataService } from "../../lib/data-service"

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const result = await dataService.getVehicles()
        if (result.success) {
          setVehicles(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError('Failed to fetch vehicles')
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const result = await dataService.deleteVehicle(vehicleId)
        if (result.success) {
          setVehicles(vehicles.filter(v => v._id !== vehicleId))
        } else {
          alert('Failed to delete vehicle: ' + result.error)
        }
      } catch (err) {
        alert('Error deleting vehicle')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="relative w-12 h-12 mb-4"
        >
          <div className="absolute inset-0 border-3 border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full" />
        </motion.div>
        <p className="text-gray-400 font-medium">Loading your vehicles...</p>
        <p className="text-gray-500 text-sm mt-2">Syncing with fleet data</p>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-12"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="mb-4"
        >
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
        </motion.div>
        <p className="text-red-400 font-semibold mb-2">Failed to Load Vehicles</p>
        <p className="text-gray-400 text-sm mb-6">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </motion.button>
      </motion.div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-12"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="mb-4"
        >
          <Zap className="w-12 h-12 text-orange-400 mx-auto" />
        </motion.div>
        <p className="text-gray-300 font-semibold mb-2">No Vehicles Yet</p>
        <p className="text-gray-400 text-sm mb-6">Add your first vehicle to get started</p>
        <motion.button
          whileHover={{ scale: 1.05, shadow: "0 0 20px rgba(249, 115, 22, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add First Vehicle
        </motion.button>
      </motion.div>
    )
  }
  return (
    <div className="space-y-4">
      {/* Fleet Summary */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Vehicles</p>
              <p className="text-3xl font-bold text-white">{vehicles.length}</p>
            </div>
            <Zap className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Now</p>
              <p className="text-3xl font-bold text-white">{vehicles.filter(v => v.status === 'active').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Avg Occupancy</p>
              <p className="text-3xl font-bold text-white">
                {vehicles.length > 0
                  ? Math.round(
                      vehicles.reduce((sum, v) => sum + (v.currentOccupancy / v.capacity), 0) / vehicles.length * 100
                    )
                  : 0}%
              </p>
            </div>
            <Users className="w-8 h-8 text-orange-400 opacity-50" />
          </div>
        </motion.div>
      </motion.div>

      {/* Vehicle Cards */}
      {vehicles.map((vehicle, idx) => (
        <motion.div
          key={vehicle._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ y: -2, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)" }}
          className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/20 hover:border-cyan-400/50 rounded-2xl p-6 transition-all duration-300 backdrop-blur-xl"
        >
          {/* Header with Registration */}
          <div className="flex items-start justify-between mb-5 pb-4 border-b border-purple-500/10">
            <div className="flex-1">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold text-white mb-1"
              >
                {vehicle.registrationNumber}
              </motion.h3>
              <p className="text-sm text-gray-400">
                {vehicle.model} • {vehicle.fuelType || 'Diesel'}
              </p>
            </div>
            <motion.div
              animate={{
                backgroundColor: vehicle.status === "active" ? "rgba(34, 197, 94, 0.1)" : "rgba(107, 114, 128, 0.1)"
              }}
              className="px-4 py-2 rounded-lg flex items-center gap-2 border border-transparent"
            >
              {vehicle.status === "active" ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  />
                  <span className="text-sm font-semibold text-green-400">Active</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-500 rounded-full" />
                  <span className="text-sm font-semibold text-gray-400">Inactive</span>
                </>
              )}
            </motion.div>
          </div>

          {/* Main Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {/* Route */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-700/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <p className="text-gray-400 text-xs font-medium uppercase">Route</p>
              </div>
              <p className="text-white font-semibold text-sm">{vehicle.route?.name || 'Unassigned'}</p>
            </motion.div>

            {/* Occupancy */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-700/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <p className="text-gray-400 text-xs font-medium uppercase">Occupancy</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-sm">
                    {vehicle.currentOccupancy || 0}/{vehicle.capacity}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {Math.round((vehicle.currentOccupancy / vehicle.capacity) * 100)}%
                  </span>
                </div>
                <motion.div
                  className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(vehicle.currentOccupancy / vehicle.capacity) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Fuel */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-700/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Fuel className="w-4 h-4 text-orange-400" />
                <p className="text-gray-400 text-xs font-medium uppercase">Fuel</p>
              </div>
              <div className="space-y-2">
                <span className="text-white font-semibold text-sm">{vehicle.fuel || 0}%</span>
                <motion.div
                  className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${vehicle.fuel || 0}%` }}
                    transition={{ duration: 1 }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Driver */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-700/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-gray-400 text-xs font-medium uppercase">Driver</p>
              </div>
              <p className="text-white font-semibold text-sm">{vehicle.driver?.name || 'Unassigned'}</p>
            </motion.div>
          </div>

          {/* Footer with Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-purple-500/10">
            <div className="flex items-center gap-3">
              {vehicle.driver && (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20"
                >
                  Driver Assigned
                </motion.span>
              )}
              {vehicle.status === "active" && (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20"
                >
                  In Service
                </motion.span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.15, backgroundColor: "rgba(34, 197, 94, 0.2)" }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 hover:bg-cyan-500/20 rounded-lg text-cyan-400 transition-colors"
                title="Edit Vehicle"
              >
                <Edit2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.15, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDeleteVehicle(vehicle._id)}
                className="p-2.5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                title="Delete Vehicle"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
