"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit2, Trash2, Fuel, AlertTriangle, CheckCircle, Zap, Plus } from "lucide-react"
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
        <span className="ml-2 text-gray-400">Loading vehicles...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-400">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
        >
          Retry
        </button>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400 mb-4">No vehicles found</p>
        <button className="flex items-center gap-2 mx-auto px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:shadow-lg">
          <Plus className="w-4 h-4" />
          Add First Vehicle
        </button>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      {vehicles.map((vehicle, idx) => (
        <motion.div
          key={vehicle._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-6 hover:border-cyan-400/50 transition-all backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">License Plate</p>
              <p className="text-lg font-bold text-white">{vehicle.registrationNumber}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Route</p>
              <p className="text-lg font-bold text-white">{vehicle.route?.name || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Occupancy</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 to-cyan-400"
                    style={{ width: `${(vehicle.currentOccupancy / vehicle.capacity) * 100}%` }}
                  />
                </div>
                <p className="text-lg font-bold text-cyan-400">
                  {vehicle.currentOccupancy || 0}/{vehicle.capacity}
                </p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Fuel</p>
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-orange-500" />
                <span className="text-lg font-bold text-white">{vehicle.fuel || 0}%</span>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-cyan-500/20 rounded-lg text-cyan-400 transition-colors"
                title="Edit Vehicle"
              >
                <Edit2 className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteVehicle(vehicle._id)}
                className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                title="Delete Vehicle"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-purple-500/20">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                vehicle.status === "active" ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-700/50 text-gray-400"
              }`}
            >
              <Zap className="w-3 h-3" /> {vehicle.status}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 bg-blue-500/20 text-blue-400">
              {vehicle.model && `${vehicle.model} • `}{vehicle.fuelType || 'Diesel'}
            </span>
            {vehicle.driver && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
                Driver: {vehicle.driver.name}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
