"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LogOut,
  AlertCircle,
  CheckCircle,
  Phone,
  Navigation,
  Gauge,
  Fuel,
  Users,
  MapPin,
  Clock,
  Zap,
  TrendingUp,
  Bell,
  Settings,
  MoreVertical,
  Plus,
  X,
  ChevronDown,
  Droplet,
  Thermometer,
  Wifi,
  Battery,
  Route,
  StopCircle,
  Shield,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Star,
  Award,
  Target,
  Activity,
  BarChart3,
  Calendar,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  Save,
  Share2,
  Filter,
  Search,
  SortAsc,
  Map,
  Compass,
  Radio,
  Headphones,
  Bluetooth,
  Smartphone,
  Monitor,
  HardDrive,
  Cpu,
  MemoryStick,
  WifiOff,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
} from "lucide-react"
import { dataService } from "../../lib/data-service"

export default function DriverApp({ userData, onLogout }) {
  const [tripStarted, setTripStarted] = useState(false)
  const [showSpeedometer, setShowSpeedometer] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")

  const [students, setStudents] = useState([])
  const [currentTrip, setCurrentTrip] = useState(null)
  const [vehicle, setVehicle] = useState(null)
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(true)

  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        setLoading(true)
        const [tripsResult, vehiclesResult, routesResult] = await Promise.all([
          dataService.getTrips(),
          dataService.getVehicles(),
          dataService.getRoutes()
        ])
        
        if (vehiclesResult.success) {
          const driverVehicle = vehiclesResult.data.find(v => v.driver?.email === userData.email)
          setVehicle(driverVehicle)
          
          if (driverVehicle && routesResult.success) {
            const vehicleRoute = routesResult.data.find(r => r._id === driverVehicle.route)
            setRoute(vehicleRoute)
          }
        }
        
        if (tripsResult.success) {
          const activeTrip = tripsResult.data.find(t => 
            t.driver?.email === userData.email && t.status === 'in-progress'
          )
          setCurrentTrip(activeTrip)
          setTripStarted(!!activeTrip)
          
          if (activeTrip && route) {
            // Get students for this route
            const routeStudents = route.students || []
            setStudents(routeStudents.map((studentId, idx) => ({
              id: studentId,
              name: `Student ${idx + 1}`,
              stop: `Stop ${idx % 3 + 1}`,
              status: Math.random() > 0.5 ? 'boarded' : 'pending',
              seatNum: `S-${idx + 1}`,
              phone: '98765432**',
              guardianName: `Guardian ${idx + 1}`
            })))
          }
        }
      } catch (err) {
        console.error('Failed to fetch driver data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDriverData()
    const interval = setInterval(fetchDriverData, 30000)
    return () => clearInterval(interval)
  }, [userData.email, route])

  const [tripStats, setTripStats] = useState({
    distance: 12.5,
    avgSpeed: 42,
    maxSpeed: 58,
    stops: 3,
    duration: "28 mins",
    efficiency: 8.2,
  })

  const handleStudentBoarded = async (id) => {
    setStudents(students.map((s) => (s.id === id ? { ...s, status: "boarded" } : s)))
    
    if (currentTrip) {
      try {
        await dataService.boardStudent(currentTrip._id, { studentId: id })
      } catch (err) {
        console.error('Failed to update boarding status:', err)
      }
    }
  }

  const handleStartTrip = async () => {
    if (!tripStarted && vehicle && route) {
      try {
        const tripData = {
          vehicle: vehicle._id,
          driver: userData.id,
          route: route._id,
          status: 'in-progress'
        }
        const result = await dataService.createTrip(tripData)
        if (result.success) {
          setCurrentTrip(result.data)
          setTripStarted(true)
        }
      } catch (err) {
        console.error('Failed to start trip:', err)
      }
    } else if (tripStarted && currentTrip) {
      try {
        await dataService.endTrip(currentTrip._id)
        setTripStarted(false)
        setCurrentTrip(null)
      } catch (err) {
        console.error('Failed to end trip:', err)
      }
    }
  }

  const handleDismissNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const filteredStudents = filterStatus === "all" ? students : students.filter((s) => s.status === filterStatus)

  const currentSpeed = vehicle?.speed || 0
  const maxSpeed = 80
  const boardedCount = students.filter((s) => s.status === "boarded").length
  const totalStudents = students.length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading driver dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-20">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header with Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Hi, {userData.name}! 👋</h1>
            <p className="text-gray-400 mt-1">{route?.name || 'No Route Assigned'} - {route?.stops?.length || 0} stops | Vehicle: {vehicle?.registrationNumber || 'No Vehicle'}</p>
            <div className="flex gap-6 mt-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-300">ETA: 45 mins</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Signal: Strong</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 hover:bg-cyan-500/20 rounded-lg text-cyan-400 transition-all"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={onLogout}
              className="p-3 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Notifications Panel */}
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-slate-800/50 border border-purple-500/30 rounded-2xl p-4 max-h-64 overflow-y-auto"
          >
            <h3 className="text-lg font-bold text-white mb-3">Notifications</h3>
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      notif.type === "alert"
                        ? "bg-red-500/10 border-red-500/30"
                        : notif.type === "success"
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-blue-500/10 border-blue-500/30"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white">{notif.title}</p>
                      <p className="text-xs text-gray-400">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                    <button
                      onClick={() => handleDismissNotification(notif.id)}
                      className="text-gray-400 hover:text-white transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-4">No notifications</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Trip Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6"
        >
          {/* Main Trip Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-purple-500/30 backdrop-blur-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50"
          >
            <img src="/gps-tracking-map-interface.jpg" alt="Current Route" className="w-full h-48 object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 to-slate-900/70 flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    className={`w-3 h-3 rounded-full ${tripStarted ? "bg-cyan-400" : "bg-orange-400"}`}
                  ></motion.div>
                  <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Trip Status</p>
                </div>
                <p className="text-4xl font-bold text-white mt-2">{tripStarted ? "In Progress" : "Ready to Start"}</p>
                <p className="text-sm text-gray-400 mt-1">{route?.name || 'No Route'} • {route?.stops?.length || 0} scheduled stops</p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs text-gray-400">Distance</p>
                    <p className="font-bold text-white">{tripStats.distance} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-xs text-gray-400">Students</p>
                    <p className="font-bold text-white">{boardedCount}/{totalStudents}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="font-bold text-white">{tripStats.duration}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: tripStarted ? "42%" : "0%" }}
                transition={{ duration: 2 }}
                className="bg-gradient-to-r from-orange-500 via-cyan-400 to-blue-500 h-full"
              />
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.button
            whileHover={{ y: -4 }}
            onClick={() => setShowStats(!showStats)}
            className="rounded-2xl border border-purple-500/30 backdrop-blur-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 text-left hover:border-cyan-400/50 transition-all"
          >
            <TrendingUp className="w-6 h-6 text-cyan-400 mb-3" />
            <p className="text-xs text-gray-400 mb-2">Trip Performance</p>
            <p className="text-2xl font-bold text-white">{tripStats.avgSpeed}</p>
            <p className="text-xs text-gray-400 mt-1">avg km/h</p>
            <div className="mt-4 pt-4 border-t border-purple-500/30 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Max Speed:</span>
                <span className="font-bold text-orange-400">{tripStats.maxSpeed} km/h</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Efficiency:</span>
                <span className="font-bold text-green-400">{tripStats.efficiency} km/l</span>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Vehicle Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <motion.div whileHover={{ y: -4 }} className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4 hover:border-cyan-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Gauge className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-gray-400">Speed</span>
            </div>
            <p className="text-2xl font-bold text-white">{currentSpeed}</p>
            <p className="text-xs text-gray-400 mt-1">km/h</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4 hover:border-orange-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Fuel className="w-5 h-5 text-orange-400" />
              <span className="text-xs text-gray-400">Fuel</span>
            </div>
            <p className="text-2xl font-bold text-orange-400">{vehicle?.fuel || 0}%</p>
            <div className="w-full bg-slate-700 rounded-full h-1 mt-2">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-1 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4 hover:border-green-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Battery className="w-5 h-5 text-green-400" />
              <span className="text-xs text-gray-400">Battery</span>
            </div>
            <p className="text-2xl font-bold text-green-400">92%</p>
            <p className="text-xs text-gray-400 mt-1">Excellent</p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Thermometer className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-400">Temp</span>
            </div>
            <p className="text-2xl font-bold text-purple-400">78°C</p>
            <p className="text-xs text-gray-400 mt-1">Normal</p>
          </motion.div>
        </div>

        {/* Trip Controls */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSpeedometer(!showSpeedometer)}
            className="flex items-center justify-center gap-2 bg-slate-800/50 border border-purple-500/30 hover:border-cyan-400/50 py-3 rounded-lg text-cyan-400 font-semibold transition-all"
          >
            <Gauge className="w-5 h-5" />
            Speed Monitor
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 bg-slate-800/50 border border-purple-500/30 hover:border-cyan-400/50 py-3 rounded-lg text-cyan-400 font-semibold transition-all"
          >
            <Navigation className="w-5 h-5" />
            Navigate
          </motion.button>
        </div>

        {/* Speedometer */}
        {showSpeedometer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6 mb-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 text-center">Speed Monitor</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="95" fill="none" stroke="#2a2a3e" strokeWidth="2" />
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#1a1a2e" strokeWidth="1" />
                  {[...Array(9)].map((_, i) => {
                    const angle = (i * 20 - 90) * (Math.PI / 180)
                    const x1 = 100 + 85 * Math.cos(angle)
                    const y1 = 100 + 85 * Math.sin(angle)
                    const x2 = 100 + 95 * Math.cos(angle)
                    const y2 = 100 + 95 * Math.sin(angle)
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9a9aaa" strokeWidth="2" />
                  })}
                  <motion.line
                    x1="100"
                    y1="100"
                    x2={100 + 70 * Math.cos((((currentSpeed / maxSpeed) * 160 - 90) * Math.PI) / 180)}
                    y2={100 + 70 * Math.sin((((currentSpeed / maxSpeed) * 160 - 90) * Math.PI) / 180)}
                    stroke="#ff6b35"
                    strokeWidth="3"
                    strokeLinecap="round"
                    animate={{ rotate: (currentSpeed / maxSpeed) * 160 - 90 }}
                  />
                  <circle cx="100" cy="100" r="6" fill="#ff6b35" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div>
                    <p className="text-2xl font-bold text-white">{currentSpeed}</p>
                    <p className="text-xs text-gray-400">km/h</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-gray-400">Speed Limit: {maxSpeed} km/h</p>
          </motion.div>
        )}

        {/* Trip Controls & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Main Trip Control */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartTrip}
            className={`lg:col-span-2 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
              tripStarted
                ? "bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg hover:shadow-red-500/50"
                : "bg-gradient-to-r from-orange-500 to-pink-500 hover:shadow-lg hover:shadow-orange-500/50"
            }`}
          >
            <StopCircle className="w-6 h-6" />
            {tripStarted ? "End Trip" : "Start Trip"}
          </motion.button>

          {/* Speed Monitor Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSpeedometer(!showSpeedometer)}
            className="bg-slate-800/50 border border-purple-500/30 hover:border-cyan-400/50 py-4 rounded-xl text-cyan-400 font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Gauge className="w-5 h-5" />
            {showSpeedometer ? "Hide" : "Speed"}
          </motion.button>
        </div>

        {/* Enhanced Speedometer */}
        {showSpeedometer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, height: 0 }}
            animate={{ opacity: 1, scale: 1, height: "auto" }}
            exit={{ opacity: 0, scale: 0.9, height: 0 }}
            className="bg-slate-800/50 border border-purple-500/30 rounded-2xl p-8 mb-6 overflow-hidden"
          >
            <h3 className="text-lg font-bold text-white mb-6 text-center">Speed Monitor & Vehicle Diagnostics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Speedometer Gauge */}
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4">
                  <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-lg">
                    {/* Gauge background */}
                    <defs>
                      <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="95" fill="none" stroke="#2a2a3e" strokeWidth="2" />
                    <path d="M 100 100 L 100 15" stroke="#4f4f5f" strokeWidth="1" />
                    {[...Array(9)].map((_, i) => {
                      const angle = (i * 20 - 90) * (Math.PI / 180)
                      const x1 = 100 + 85 * Math.cos(angle)
                      const y1 = 100 + 85 * Math.sin(angle)
                      const x2 = 100 + 95 * Math.cos(angle)
                      const y2 = 100 + 95 * Math.sin(angle)
                      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9a9aaa" strokeWidth="2" />
                    })}
                    {/* Colored zones */}
                    <path
                      d="M 100 20 A 80 80 0 0 1 176 100"
                      fill="none"
                      stroke="url(#speedGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Speed needle */}
                    <motion.line
                      x1="100"
                      y1="100"
                      x2={100 + 70 * Math.cos((((currentSpeed / maxSpeed) * 160 - 90) * Math.PI) / 180)}
                      y2={100 + 70 * Math.sin((((currentSpeed / maxSpeed) * 160 - 90) * Math.PI) / 180)}
                      stroke="#00d9ff"
                      strokeWidth="4"
                      strokeLinecap="round"
                      animate={{ rotate: (currentSpeed / maxSpeed) * 160 - 90 }}
                      transition={{ type: "spring", damping: 15 }}
                    />
                    <circle cx="100" cy="100" r="8" fill="#00d9ff" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold text-cyan-400">{currentSpeed}</p>
                    <p className="text-xs text-gray-400">km/h</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">Speed Limit: {maxSpeed} km/h</p>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-white">Average Speed</span>
                    <span className="text-lg font-bold text-cyan-400">{tripStats.avgSpeed} km/h</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: `${(tripStats.avgSpeed / maxSpeed) * 100}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-white">Max Speed</span>
                    <span className="text-lg font-bold text-orange-400">{tripStats.maxSpeed} km/h</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: `${(tripStats.maxSpeed / maxSpeed) * 100}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-white">Fuel Efficiency</span>
                    <span className="text-lg font-bold text-green-400">{tripStats.efficiency} km/l</span>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-sm text-green-300">✓ Excellent driving! 12% better fuel economy</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Student Manifest with Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Student Manifest</h2>
            <span className="bg-cyan-500/20 text-cyan-300 text-xs px-3 py-1 rounded-full font-semibold">
              {boardedCount}/{totalStudents} Boarded
            </span>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {["all", "boarded", "pending"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(tab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  filterStatus === tab
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                    : "bg-slate-800/50 border border-purple-500/30 text-gray-300 hover:border-purple-400/60"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({students.filter((s) => (tab === "all" ? true : s.status === tab)).length})
              </motion.button>
            ))}
          </div>

          {/* Students List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredStudents.map((student, idx) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx }}
                onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
                className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4 hover:border-cyan-400/50 transition-all cursor-pointer hover:bg-slate-800/70"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-white">{student.name}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          student.status === "boarded"
                            ? "bg-cyan-500/20 text-cyan-300"
                            : "bg-orange-500/20 text-orange-300"
                        }`}
                      >
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {student.stop} • Seat {student.seatNum}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStudentBoarded(student.id)
                    }}
                    className={`p-2 rounded-lg transition-all ${
                      student.status === "boarded"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-slate-700/50 hover:bg-orange-500/20 text-orange-400 border border-purple-500/30"
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Expanded View */}
                {selectedStudent?.id === student.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-purple-500/20 space-y-2"
                  >
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-700/50 p-2 rounded">
                        <p className="text-gray-400">Guardian</p>
                        <p className="font-semibold text-white">{student.guardianName}</p>
                      </div>
                      <div className="bg-slate-700/50 p-2 rounded">
                        <p className="text-gray-400">Phone</p>
                        <p className="font-semibold text-white">{student.phone}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs py-2 rounded transition-all flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      Call Guardian
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No students with this status</p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-cyan-400/50 transition-all"
          >
            <Phone className="w-6 h-6 text-cyan-400" />
            <span className="text-sm font-medium text-gray-300">Call Admin</span>
            <span className="text-xs text-gray-500">Report issue</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-orange-500/50 transition-all"
          >
            <Navigation className="w-6 h-6 text-orange-500" />
            <span className="text-sm font-medium text-gray-300">Navigate</span>
            <span className="text-xs text-gray-500">Next stop</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-purple-500/50 transition-all"
          >
            <Route className="w-6 h-6 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">Route Map</span>
            <span className="text-xs text-gray-500">View all stops</span>
          </motion.button>
        </div>

        {/* Emergency SOS */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/50 transition-all text-lg"
        >
          <AlertCircle className="w-6 h-6" />
          Emergency SOS
        </motion.button>
      </div>
    </div>
  )
}
