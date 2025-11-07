"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { dataService } from "../../lib/data-service"

export default function AnalyticsSection() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [period, setPeriod] = useState('week')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const result = await dataService.request(`/api/dashboard/analytics?period=${period}`)
        if (result.success) {
          setAnalyticsData(result.data)
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError('Failed to fetch analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [period])

  // Default data for loading state
  const defaultData = [
    { day: "Mon", trips: 0, students: 0, delay: 0 },
    { day: "Tue", trips: 0, students: 0, delay: 0 },
    { day: "Wed", trips: 0, students: 0, delay: 0 },
    { day: "Thu", trips: 0, students: 0, delay: 0 },
    { day: "Fri", trips: 0, students: 0, delay: 0 },
    { day: "Sat", trips: 0, students: 0, delay: 0 },
  ]

  const chartData = analyticsData?.tripAnalytics || defaultData
  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {['day', 'week', 'month'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                period === p
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-slate-700/50 text-gray-400 hover:text-white'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-2 text-gray-400">Loading analytics...</span>
        </div>
      )}

      {error && (
        <div className="text-center p-8">
          <p className="text-red-400">Error: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Trip Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-xl"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" />
          Trip Analytics
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
            <XAxis dataKey="_id" stroke="#9a9aaa" />
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
            <Bar dataKey="count" fill="#ff6b35" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Revenue Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-xl"
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
          Revenue Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData?.revenueAnalytics || defaultData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
            <XAxis dataKey="_id" stroke="#9a9aaa" />
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
              dataKey="revenue"
              stroke="#00d4ff"
              strokeWidth={3}
              dot={{ fill: "#00d4ff", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Route Efficiency */}
      {analyticsData?.routeEfficiency && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
            Route Efficiency
          </h3>
          <div className="space-y-4">
            {analyticsData.routeEfficiency.map((route, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">{route.name}</p>
                  <p className="text-gray-400 text-sm">{route.tripCount} trips</p>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 font-bold">{route.efficiency || 0}%</p>
                  <p className="text-gray-400 text-sm">{route.avgDelay || 0}min delay</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      </div>
    </div>
  )
}
