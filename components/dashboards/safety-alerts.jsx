"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, PhoneCall, Zap, Clock, RefreshCw } from "lucide-react"
import { dataService } from "../../lib/data-service"

export default function SafetyAlerts() {
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSafetyData = async () => {
      try {
        setLoading(true)
        const [alertsResult, vehiclesResult] = await Promise.all([
          dataService.getEmergencyAlerts(),
          dataService.getVehicles()
        ])
        
        if (alertsResult.success) {
          setAlerts(alertsResult.data)
        }
        if (vehiclesResult.success) {
          setVehicles(vehiclesResult.data)
        }
      } catch (err) {
        setError('Failed to fetch safety data')
      } finally {
        setLoading(false)
      }
    }

    fetchSafetyData()
    const interval = setInterval(fetchSafetyData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleResolveAlert = async (alertId) => {
    try {
      const result = await dataService.resolveAlert(alertId, 'Resolved by admin')
      if (result.success) {
        setAlerts(alerts.map(alert => 
          alert._id === alertId ? { ...alert, status: 'resolved' } : alert
        ))
      }
    } catch (err) {
      console.error('Failed to resolve alert:', err)
    }
  }

  const getExpiringDocuments = () => {
    const expiring = []
    vehicles.forEach(vehicle => {
      if (vehicle.insuranceExpiry) {
        const daysUntilExpiry = Math.ceil((new Date(vehicle.insuranceExpiry) - new Date()) / (1000 * 60 * 60 * 24))
        if (daysUntilExpiry <= 30) {
          expiring.push({
            doc: `Insurance - ${vehicle.registrationNumber}`,
            expires: daysUntilExpiry <= 0 ? 'Expired' : `${daysUntilExpiry} days`,
            status: daysUntilExpiry <= 0 ? 'critical' : 'warning'
          })
        }
      }
    })
    return expiring
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
        <span className="ml-2 text-gray-400">Loading safety data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Active Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-red-500/30 rounded-xl p-6 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-bold text-white">Active Alerts</h3>
          <span className="ml-auto px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
            {alerts.filter((a) => a.status === "active").length} Active
          </span>
        </div>

        <div className="space-y-3">
          {alerts.length > 0 ? alerts.map((alert, idx) => (
            <motion.div
              key={alert._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedAlert(alert)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                alert.status === "active"
                  ? "border-red-500/50 bg-red-500/10"
                  : alert.status === "acknowledged"
                    ? "border-orange-500/50 bg-orange-500/10"
                    : "border-cyan-500/50 bg-cyan-500/10"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {alert.severity === "critical" && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                      className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"
                    />
                  )}
                  {alert.severity !== "critical" && <div className="w-3 h-3 bg-orange-500 rounded-full" />}
                  <div>
                    <p className="font-bold text-white">{alert.type}</p>
                    <p className="text-xs text-gray-400">
                      {alert.user?.name || 'Unknown User'}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(alert.createdAt).toLocaleTimeString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">📍 {alert.location?.lat}, {alert.location?.lng}</p>
                {alert.status === "active" && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleResolveAlert(alert._id)
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:shadow-lg hover:shadow-orange-500/50"
                  >
                    <PhoneCall className="w-3 h-3" />
                    Resolve
                  </motion.button>
                )}
              </div>
            </motion.div>
          )) : (
            <div className="text-center p-4 text-gray-400">
              <p>No active alerts</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Incident Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-xl"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-500" />
          Vehicle Status
        </h3>
        <div className="space-y-3">
          {vehicles.filter(v => v.status === 'maintenance').map((vehicle, idx) => (
            <motion.div
              key={vehicle._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="p-4 bg-slate-700/30 border border-purple-500/20 rounded-lg flex items-center justify-between hover:border-cyan-400/50 transition-all"
            >
              <div>
                <p className="font-bold text-white">Vehicle Maintenance</p>
                <p className="text-sm text-gray-400">
                  {vehicle.registrationNumber} • {vehicle.model}
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-500/20 text-orange-400">
                {vehicle.status}
              </span>
            </motion.div>
          ))}
          {vehicles.filter(v => v.status === 'maintenance').length === 0 && (
            <div className="text-center p-4 text-gray-400">
              <p>All vehicles operational</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Document Expiry */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-xl"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Document Expiry Alerts
        </h3>
        <div className="space-y-3">
          {getExpiringDocuments().map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              className="flex items-center justify-between p-3 bg-slate-700/30 border border-purple-500/20 rounded-lg"
            >
              <p className="text-white font-medium">{item.doc}</p>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  item.status === "critical" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
                }`}
              >
                {item.expires}
              </span>
            </motion.div>
          ))}
          {getExpiringDocuments().length === 0 && (
            <div className="text-center p-4 text-gray-400">
              <p>All documents are up to date</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}