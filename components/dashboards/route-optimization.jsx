"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Zap, TrendingDown, Clock, BarChart3, RefreshCw } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { dataService } from "../../lib/data-service"

export default function RouteOptimization() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [optimizationStats, setOptimizationStats] = useState(null)

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        setLoading(true)
        const result = await dataService.getRoutes()
        if (result.success) {
          setRoutes(result.data)
          calculateOptimizationStats(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError('Failed to fetch route data')
      } finally {
        setLoading(false)
      }
    }

    fetchRouteData()
  }, [])

  const calculateOptimizationStats = (routeData) => {
    const totalRoutes = routeData.length
    const avgEfficiency = routeData.reduce((sum, route) => sum + (route.optimization?.efficiency || 0), 0) / totalRoutes
    const totalTimeSaved = routeData.reduce((sum, route) => sum + (route.optimization?.delayAverage || 0), 0)
    
    setOptimizationStats({
      avgEfficiency: Math.round(avgEfficiency),
      timeSaved: Math.round(totalTimeSaved),
      co2Reduced: Math.round(totalTimeSaved * 2.3), // Estimate
      routesOptimized: totalRoutes
    })
  }

  const handleOptimizeRoute = async (routeId) => {
    try {
      const result = await dataService.optimizeRoute(routeId)
      if (result.success) {
        // Refresh routes data
        const updatedRoutes = await dataService.getRoutes()
        if (updatedRoutes.success) {
          setRoutes(updatedRoutes.data)
          calculateOptimizationStats(updatedRoutes.data)
        }
      }
    } catch (err) {
      console.error('Failed to optimize route:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
        <span className="ml-2 text-gray-400">Loading route data...</span>
      </div>
    )
  }

  const stats = optimizationStats ? [
    { label: "Avg Efficiency", value: `${optimizationStats.avgEfficiency}%`, icon: Zap, color: "from-orange-500 to-pink-500" },
    { label: "Avg Delay", value: `${optimizationStats.timeSaved} min`, icon: Clock, color: "from-cyan-500 to-blue-500" },
    { label: "CO2 Estimate", value: `${optimizationStats.co2Reduced} kg/week`, icon: TrendingDown, color: "from-green-500 to-emerald-500" },
    { label: "Total Routes", value: `${optimizationStats.routesOptimized}`, icon: BarChart3, color: "from-purple-500 to-pink-500" },
  ] : []
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative rounded-xl p-6 backdrop-blur-xl border border-purple-500/30 overflow-hidden group"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity`}
            />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" />
            Time Optimization
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routes.map(route => ({
              route: route.name,
              before: route.estimatedDuration + (route.optimization?.delayAverage || 0),
              after: route.estimatedDuration,
              savings: route.optimization?.delayAverage || 0
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis dataKey="route" stroke="#9a9aaa" />
              <YAxis stroke="#9a9aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid #8b5cf6",
                  borderRadius: "8px",
                  boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="before" fill="#ff6b35" radius={[8, 8, 0, 0]} name="Before" />
              <Bar dataKey="after" fill="#00d4ff" radius={[8, 8, 0, 0]} name="After" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
            Route Efficiency
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={routes.map(route => ({
              route: route.name,
              efficiency: route.optimization?.efficiency || 0
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis dataKey="route" stroke="#9a9aaa" />
              <YAxis stroke="#9a9aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid #8b5cf6",
                  borderRadius: "8px",
                  boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#00d4ff"
                strokeWidth={3}
                dot={{ fill: "#00d4ff", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-xl overflow-x-auto"
      >
        <h3 className="text-lg font-bold text-white mb-4">Routes Overview</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-500/30">
              <th className="text-left py-3 px-4 font-semibold text-gray-400">Route</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-400">Distance</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-400">Est. Time</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-400">Students</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-400">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route, idx) => (
              <motion.tr
                key={route._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="border-b border-purple-500/20 hover:bg-slate-700/30 transition-colors"
              >
                <td className="py-3 px-4 font-bold text-white">{route.name}</td>
                <td className="py-3 px-4 text-gray-300">{route.distance || 0} km</td>
                <td className="py-3 px-4 text-gray-300">{route.estimatedDuration || 0} min</td>
                <td className="py-3 px-4 text-gray-300">{route.students?.length || 0}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full">
                      {route.optimization?.efficiency || 0}%
                    </span>
                    <button
                      onClick={() => handleOptimizeRoute(route._id)}
                      className="px-2 py-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs rounded transition-all"
                    >
                      Optimize
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
