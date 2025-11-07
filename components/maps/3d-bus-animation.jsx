"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function BusAnimation3D() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const routePoints = [
    { x: 0, y: 0 },
    { x: 100, y: -50 },
    { x: 200, y: 0 },
    { x: 300, y: 50 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">Route Visualization</h2>

      <div className="relative w-full h-80 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl overflow-hidden border border-slate-700/30 flex items-center justify-center">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full"
          style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2a2a3e 100%)" }}
        >
          {/* Road/Route */}
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Route line */}
          <polyline
            points="20,100 100,80 200,100 300,70 380,100"
            fill="none"
            stroke="url(#roadGradient)"
            strokeWidth="20"
            filter="url(#glow)"
          />

          {/* Stop points */}
          {[20, 100, 200, 300, 380].map((x, idx) => (
            <motion.g key={idx}>
              <circle cx={x} cy={100} r="8" fill="#2a2a3e" stroke="#00d4ff" strokeWidth="2" />
              <motion.circle
                cx={x}
                cy={100}
                r="8"
                fill="none"
                stroke="#00d4ff"
                strokeWidth="1"
                animate={{ r: [8, 15], opacity: [1, 0] }}
                transition={{ duration: 2, delay: idx * 0.3, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.g>
          ))}

          {/* Animated Bus */}
          <motion.g
            animate={{
              x: [0, 360],
              rotate: 0,
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{ transformOrigin: "200px 100px" }}
          >
            {/* Bus body */}
            <rect x="180" y="85" width="40" height="30" fill="#ff6b35" rx="4" filter="url(#glow)" />

            {/* Windows */}
            <rect x="185" y="88" width="8" height="8" fill="#1a1a2e" />
            <rect x="197" y="88" width="8" height="8" fill="#1a1a2e" />
            <rect x="209" y="88" width="8" height="8" fill="#1a1a2e" />

            {/* Wheels */}
            <circle cx="188" cy="118" r="4" fill="#2a2a3e" />
            <circle cx="212" cy="118" r="4" fill="#2a2a3e" />
          </motion.g>

          {/* Speed indicator trail */}
          <motion.circle
            cx="200"
            cy="100"
            r="20"
            fill="none"
            stroke="#00d4ff"
            strokeWidth="1"
            opacity="0.3"
            animate={{ r: [15, 35], opacity: [0.6, 0] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          />
        </svg>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-sidebar rounded-lg p-4 text-center">
          <p className="text-muted-foreground text-sm">Distance Traveled</p>
          <p className="text-2xl font-bold text-primary mt-1">45.2 km</p>
        </div>
        <div className="bg-sidebar rounded-lg p-4 text-center">
          <p className="text-muted-foreground text-sm">Avg Speed</p>
          <p className="text-2xl font-bold text-accent mt-1">42 km/h</p>
        </div>
        <div className="bg-sidebar rounded-lg p-4 text-center">
          <p className="text-muted-foreground text-sm">Time Remaining</p>
          <p className="text-2xl font-bold text-chart-5 mt-1">8 mins</p>
        </div>
      </div>
    </motion.div>
  )
}
