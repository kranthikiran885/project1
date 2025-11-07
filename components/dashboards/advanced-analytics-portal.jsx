"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Filter } from "lucide-react"

export default function AdvancedAnalyticsPortal() {
  const [timeRange, setTimeRange] = useState("month")
  const [selectedMetrics, setSelectedMetrics] = useState(["trips", "revenue", "satisfaction"])

  const metrics = [
    { id: "trips", label: "Total Trips", value: "2,847", change: "+12.5%", color: "from-blue-500 to-cyan-500" },
    { id: "revenue", label: "Revenue", value: "$48,560", change: "+8.2%", color: "from-chart-5 to-green-500" },
    { id: "satisfaction", label: "Satisfaction", value: "4.8/5", change: "+0.3", color: "from-purple-500 to-pink-500" },
    { id: "safety", label: "Safety Score", value: "98.5%", change: "+2.1%", color: "from-orange-500 to-red-500" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">Advanced Analytics</h2>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 bg-sidebar rounded-lg text-accent font-semibold"
          >
            <Filter className="w-4 h-4" />
            Filter
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700/50 rounded-xl p-6"
          >
            <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
            <p className="text-3xl font-bold text-foreground mb-3">{metric.value}</p>
            <p className={`text-sm font-semibold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
              {metric.change} from last period
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-sidebar rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Trip Trends</h3>
          <svg viewBox="0 0 400 200" className="w-full h-40">
            <polyline
              points="0,150 50,120 100,140 150,80 200,100 250,60 300,90 350,40 400,20"
              fill="none"
              stroke="#ff6b35"
              strokeWidth="3"
            />
            <polyline
              points="0,160 50,140 100,155 150,100 200,120 250,85 300,110 350,70 400,50"
              fill="none"
              stroke="#00d4ff"
              strokeWidth="2"
              opacity="0.5"
            />
          </svg>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-sidebar rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Revenue Distribution</h3>
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-40 h-40">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#ff6b35" strokeWidth="30" opacity="0.6" />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#00d4ff"
                strokeWidth="20"
                opacity="0.4"
                strokeDasharray="141.3 565.2"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#a100f2"
                strokeWidth="15"
                opacity="0.3"
                strokeDasharray="94.2 565.2"
                strokeDashoffset="-141.3"
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
