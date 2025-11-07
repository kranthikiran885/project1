"use client"

import { motion } from "framer-motion"
import { BarChart3, Users, Bus, TrendingUp, AlertCircle, DollarSign } from "lucide-react"

const METRICS = [
  { label: "Active Vehicles", value: "24", icon: Bus, color: "from-orange-500 to-pink-500", trend: "+5%" },
  { label: "Total Students", value: "1,250", icon: Users, color: "from-cyan-500 to-blue-500", trend: "+12%" },
  { label: "Active Trips", value: "18", icon: BarChart3, color: "from-purple-500 to-pink-500", trend: "+8%" },
  { label: "Route Efficiency", value: "94%", icon: TrendingUp, color: "from-green-500 to-emerald-500", trend: "+3%" },
  { label: "System Alerts", value: "3", icon: AlertCircle, color: "from-red-500 to-orange-500", trend: "-2%" },
  { label: "Revenue Today", value: "$4,250", icon: DollarSign, color: "from-yellow-500 to-orange-500", trend: "+15%" },
]

export default function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {METRICS.map((metric, idx) => {
        const Icon = metric.icon
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative rounded-xl p-6 backdrop-blur-xl border border-purple-500/30 overflow-hidden group"
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-10 group-hover:opacity-20 transition-opacity`}
            />

            {/* Content */}
            <div className="relative z-10 flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{metric.label}</p>
                <p className="text-3xl font-bold text-white">{metric.value}</p>
              </div>
              <motion.div
                whileHover={{ rotate: 12 }}
                className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} shadow-lg`}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <span className="text-xs font-semibold text-cyan-400">{metric.trend}</span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
