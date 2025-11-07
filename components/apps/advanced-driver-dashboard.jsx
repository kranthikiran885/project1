"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LogOut, AlertCircle, CheckCircle, Phone, Navigation, Gauge, Fuel, Users, MapPin, Clock,
  Zap, TrendingUp, Bell, Settings, MoreVertical, Plus, X, ChevronDown, Droplet, Thermometer,
  Wifi, Battery, Route, StopCircle, Shield, Camera, Mic, MicOff, Video, VideoOff,
  MessageSquare, Star, Award, Target, Activity, BarChart3, Calendar, FileText, Download,
  Upload, RefreshCw, Eye, EyeOff, Volume2, VolumeX, Maximize, Minimize, RotateCcw,
  Save, Share2, Filter, Search, SortAsc, Map, Compass, Radio, Headphones, Bluetooth,
  Smartphone, Monitor, HardDrive, Cpu, MemoryStick, WifiOff, Signal, SignalHigh
} from "lucide-react"
import { useRealTimeData } from "@/hooks/useRealTimeData"
import { useSocket } from "@/components/realtime/socket-integration"

export default function AdvancedDriverDashboard({ userData, onLogout }) {
  const [tripStarted, setTripStarted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showSpeedometer, setShowSpeedometer] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [dashcamRecording, setDashcamRecording] = useState(false)
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [aiAssistant, setAiAssistant] = useState(false)
  const [performanceMode, setPerformanceMode] = useState("eco")
  const [weatherData, setWeatherData] = useState({ temp: 24, condition: "Clear", humidity: 65 })

  const { vehicles, trips, loading, error, updateVehicleLocation, startTrip, endTrip, boardStudent, createEmergencyAlert } = useRealTimeData()
  const { connected, notifications, emitLocationUpdate, emitStudentBoarding, emitEmergencySOS, clearNotification } = useSocket()

  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", stop: "Stop-A", status: "pending", seatNum: "A-01", phone: "98765432**", guardianName: "Mrs. Doe", photo: "👨‍🎓", priority: "normal", medicalInfo: "None" },
    { id: 2, name: "Sarah Smith", stop: "Stop-A", status: "boarded", seatNum: "A-02", phone: "98765433**", guardianName: "Mr. Smith", photo: "👩‍🎓", priority: "normal", medicalInfo: "Asthma" },
    { id: 3, name: "Mike Johnson", stop: "Stop-B", status: "pending", seatNum: "B-01", phone: "98765434**", guardianName: "Mrs. Johnson", photo: "👨‍🎓", priority: "high", medicalInfo: "Diabetes" },
    { id: 4, name: "Emma Davis", stop: "Stop-B", status: "boarded", seatNum: "B-02", phone: "98765435**", guardianName: "Mr. Davis", photo: "👩‍🎓", priority: "normal", medicalInfo: "None" },
    { id: 5, name: "Liam Brown", stop: "Stop-C", status: "pending", seatNum: "C-01", phone: "98765436**", guardianName: "Mrs. Brown", photo: "👨‍🎓", priority: "normal", medicalInfo: "Allergies" },
  ])

  const [vehicleStats, setVehicleStats] = useState({
    speed: 45, maxSpeed: 80, fuel: 75, temperature: 85, battery: 92, mileage: 8.2,
    rpm: 2200, gear: "D", odometer: 45678, tripDistance: 12.5, avgSpeed: 42,
    fuelEfficiency: 12.5, co2Emission: 145, engineHealth: 95, brakeHealth: 88,
    tireHealth: 92, lastService: "2 weeks ago", nextService: "3 months"
  })

  const [routeData, setRouteData] = useState({
    totalStops: 8, completedStops: 3, currentStop: "Stop-C", nextStop: "Stop-D",
    eta: "25 mins", trafficStatus: "Light", alternateRoutes: 2, weatherImpact: "None"
  })

  const [performanceMetrics, setPerformanceMetrics] = useState({
    safetyScore: 95, ecoScore: 88, punctualityScore: 92, studentSatisfaction: 4.8,
    totalTrips: 156, accidentFree: 89, fuelSaved: "12%", onTimeDelivery: "96%"
  })

  const handleStudentBoarded = async (id) => {
    const student = students.find(s => s.id === id)
    if (student) {
      setStudents(students.map((s) => (s.id === id ? { ...s, status: "boarded" } : s)))
      emitStudentBoarding({ studentId: id, name: student.name, timestamp: new Date() })
      
      // API call to update backend
      await boardStudent(trips[0]?.id, { studentId: id, seatNumber: student.seatNum })
    }
  }

  const handleEmergencyAlert = async () => {
    setEmergencyMode(true)
    const alertData = {
      type: "SOS",
      location: { lat: 28.5355, lng: 77.391 },
      description: "Emergency situation reported by driver",
      severity: "critical"
    }
    
    emitEmergencySOS(alertData)
    await createEmergencyAlert(alertData)
    
    setTimeout(() => setEmergencyMode(false), 5000)
  }

  const handleTripToggle = async () => {
    if (tripStarted) {
      await endTrip(trips[0]?.id)
      setTripStarted(false)
    } else {
      await startTrip(trips[0]?.id)
      setTripStarted(true)
    }
  }

  // Real-time location updates
  useEffect(() => {
    if (tripStarted) {
      const interval = setInterval(() => {
        const locationData = {
          lat: 28.5355 + (Math.random() - 0.5) * 0.001,
          lng: 77.391 + (Math.random() - 0.5) * 0.001,
          speed: vehicleStats.speed
        }
        emitLocationUpdate(locationData)
        updateVehicleLocation(vehicles[0]?.id, locationData)
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [tripStarted])

  const filteredStudents = filterStatus === "all" ? students : students.filter((s) => s.status === filterStatus)
  const boardedCount = students.filter((s) => s.status === "boarded").length
  const totalStudents = students.length

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "students", label: "Students", icon: Users },
    { id: "navigation", label: "Navigation", icon: Navigation },
    { id: "vehicle", label: "Vehicle", icon: Settings },
    { id: "performance", label: "Performance", icon: Award },
    { id: "safety", label: "Safety", icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-20">
      <div className="max-w-7xl mx-auto p-4">
        {/* Advanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                Hi, {userData.name}! 
                <span className="text-2xl">🚌</span>
                {connected && <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>}
              </h1>
              <p className="text-gray-400 mt-1">Route B2 - Advanced Driver Dashboard</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setAiAssistant(!aiAssistant)}
                className={`p-3 rounded-lg transition-all ${aiAssistant ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-cyan-500/20 text-cyan-400"}`}
              >
                <Zap className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
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
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Speed</p>
              <p className="text-lg font-bold text-cyan-400">{vehicleStats.speed} km/h</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Fuel</p>
              <p className="text-lg font-bold text-green-400">{vehicleStats.fuel}%</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Students</p>
              <p className="text-lg font-bold text-orange-400">{boardedCount}/{totalStudents}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">ETA</p>
              <p className="text-lg font-bold text-purple-400">{routeData.eta}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Safety</p>
              <p className="text-lg font-bold text-green-400">{performanceMetrics.safetyScore}%</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Weather</p>
              <p className="text-lg font-bold text-blue-400">{weatherData.temp}°C</p>
            </div>
          </div>
        </motion.div>

        {/* AI Assistant Panel */}
        <AnimatePresence>
          {aiAssistant && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">AI Assistant</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-sm text-cyan-400 font-semibold">Route Optimization</p>
                  <p className="text-xs text-gray-300">Alternative route saves 8 mins</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-sm text-green-400 font-semibold">Eco Driving</p>
                  <p className="text-xs text-gray-300">Maintain 40-50 km/h for best efficiency</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-sm text-orange-400 font-semibold">Traffic Alert</p>
                  <p className="text-xs text-gray-300">Heavy traffic ahead in 2 km</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-800/50 p-2 rounded-lg border border-purple-500/30 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Trip Status Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-purple-500/30 backdrop-blur-xl"
                >
                  <img src="/gps-tracking-map-interface.jpg" alt="Route Map" className="w-full h-64 object-cover opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 to-slate-900/70 flex flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className={`w-3 h-3 rounded-full ${tripStarted ? "bg-cyan-400" : "bg-orange-400"}`}
                        />
                        <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Trip Status</p>
                      </div>
                      <p className="text-4xl font-bold text-white mb-2">{tripStarted ? "In Progress" : "Ready to Start"}</p>
                      <p className="text-sm text-gray-400">Route B2 • {routeData.totalStops} scheduled stops</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <MapPin className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-400">Distance</p>
                        <p className="font-bold text-white">{vehicleStats.tripDistance} km</p>
                      </div>
                      <div className="text-center">
                        <Users className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-400">Students</p>
                        <p className="font-bold text-white">{boardedCount}/{totalStudents}</p>
                      </div>
                      <div className="text-center">
                        <Clock className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-400">ETA</p>
                        <p className="font-bold text-white">{routeData.eta}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Control Panel */}
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTripToggle}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                      tripStarted
                        ? "bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg hover:shadow-red-500/50"
                        : "bg-gradient-to-r from-green-600 to-green-500 hover:shadow-lg hover:shadow-green-500/50"
                    }`}
                  >
                    {tripStarted ? "End Trip" : "Start Trip"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={handleEmergencyAlert}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      emergencyMode
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                    }`}
                  >
                    <AlertCircle className="w-5 h-5 inline mr-2" />
                    {emergencyMode ? "Emergency Active!" : "Emergency SOS"}
                  </motion.button>

                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className={`p-3 rounded-lg transition-all ${
                        voiceEnabled ? "bg-green-500/20 text-green-400" : "bg-slate-700/50 text-gray-400"
                      }`}
                    >
                      {voiceEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setCameraEnabled(!cameraEnabled)}
                      className={`p-3 rounded-lg transition-all ${
                        cameraEnabled ? "bg-blue-500/20 text-blue-400" : "bg-slate-700/50 text-gray-400"
                      }`}
                    >
                      {cameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Safety Score", value: performanceMetrics.safetyScore, unit: "%", color: "green", icon: Shield },
                  { label: "Eco Score", value: performanceMetrics.ecoScore, unit: "%", color: "blue", icon: Zap },
                  { label: "Punctuality", value: performanceMetrics.punctualityScore, unit: "%", color: "purple", icon: Clock },
                  { label: "Rating", value: performanceMetrics.studentSatisfaction, unit: "/5", color: "yellow", icon: Star },
                ].map((metric, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
                      <span className={`text-2xl font-bold text-${metric.color}-400`}>
                        {metric.value}{metric.unit}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{metric.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "students" && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Student Filters */}
              <div className="flex gap-2 bg-slate-800/50 p-2 rounded-lg border border-purple-500/30">
                {["all", "pending", "boarded"].map((status) => (
                  <motion.button
                    key={status}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                      filterStatus === status
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {status} ({status === "all" ? totalStudents : students.filter(s => s.status === status).length})
                  </motion.button>
                ))}
              </div>

              {/* Student List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStudents.map((student, idx) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    className={`bg-slate-800/50 border rounded-xl p-4 transition-all ${
                      student.status === "boarded" 
                        ? "border-green-500/30 bg-green-500/5" 
                        : student.priority === "high"
                        ? "border-red-500/30 bg-red-500/5"
                        : "border-purple-500/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{student.photo}</span>
                        <div>
                          <p className="font-bold text-white">{student.name}</p>
                          <p className="text-xs text-gray-400">{student.stop} • Seat {student.seatNum}</p>
                          {student.medicalInfo !== "None" && (
                            <p className="text-xs text-orange-400">⚕️ {student.medicalInfo}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {student.priority === "high" && (
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleStudentBoarded(student.id)}
                          disabled={student.status === "boarded"}
                          className={`p-2 rounded-lg transition-all ${
                            student.status === "boarded"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-slate-700/50 hover:bg-cyan-500/20 text-cyan-400 border border-purple-500/30"
                          }`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-700/50 rounded p-2">
                        <p className="text-gray-400">Guardian</p>
                        <p className="text-white font-semibold">{student.guardianName}</p>
                      </div>
                      <div className="bg-slate-700/50 rounded p-2">
                        <p className="text-gray-400">Phone</p>
                        <p className="text-white font-semibold">{student.phone}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "vehicle" && (
            <motion.div
              key="vehicle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Vehicle Health Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Speedometer */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-4 text-center">Speed Monitor</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-48 h-48">
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
                          x2={100 + 70 * Math.cos((((vehicleStats.speed / vehicleStats.maxSpeed) * 160 - 90) * Math.PI) / 180)}
                          y2={100 + 70 * Math.sin((((vehicleStats.speed / vehicleStats.maxSpeed) * 160 - 90) * Math.PI) / 180)}
                          stroke="#ff6b35"
                          strokeWidth="3"
                          strokeLinecap="round"
                          animate={{ rotate: (vehicleStats.speed / vehicleStats.maxSpeed) * 160 - 90 }}
                        />
                        <circle cx="100" cy="100" r="6" fill="#ff6b35" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-center">
                        <div>
                          <p className="text-3xl font-bold text-white">{vehicleStats.speed}</p>
                          <p className="text-xs text-gray-400">km/h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="text-gray-400">RPM</p>
                      <p className="text-cyan-400 font-bold">{vehicleStats.rpm}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Gear</p>
                      <p className="text-orange-400 font-bold">{vehicleStats.gear}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Avg Speed</p>
                      <p className="text-green-400 font-bold">{vehicleStats.avgSpeed}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Vehicle Diagnostics */}
                <div className="space-y-4">
                  {[
                    { label: "Engine Health", value: vehicleStats.engineHealth, icon: HardDrive, color: "green" },
                    { label: "Brake System", value: vehicleStats.brakeHealth, icon: StopCircle, color: "orange" },
                    { label: "Tire Condition", value: vehicleStats.tireHealth, icon: Target, color: "blue" },
                    { label: "Battery Level", value: vehicleStats.battery, icon: Battery, color: "cyan" },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-slate-700/50 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                          <span className="text-white font-semibold">{item.label}</span>
                        </div>
                        <span className={`text-lg font-bold text-${item.color}-400`}>{item.value}%</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className={`bg-gradient-to-r from-${item.color}-500 to-${item.color}-400 h-2 rounded-full`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Fuel & Efficiency */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div whileHover={{ y: -4 }} className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Fuel className="w-6 h-6 text-green-400" />
                    <span className="text-2xl font-bold text-green-400">{vehicleStats.fuel}%</span>
                  </div>
                  <p className="text-sm text-gray-400">Fuel Level</p>
                  <p className="text-xs text-green-300 mt-1">~{Math.round(vehicleStats.fuel * 0.8)} km range</p>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-6 h-6 text-blue-400" />
                    <span className="text-2xl font-bold text-blue-400">{vehicleStats.fuelEfficiency}</span>
                  </div>
                  <p className="text-sm text-gray-400">Fuel Efficiency</p>
                  <p className="text-xs text-blue-300 mt-1">km/liter</p>
                </motion.div>

                <motion.div whileHover={{ y: -4 }} className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Thermometer className="w-6 h-6 text-orange-400" />
                    <span className="text-2xl font-bold text-orange-400">{vehicleStats.temperature}°C</span>
                  </div>
                  <p className="text-sm text-gray-400">Engine Temp</p>
                  <p className="text-xs text-orange-300 mt-1">Normal range</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDashcamRecording(!dashcamRecording)}
            className={`p-4 rounded-full shadow-lg transition-all ${
              dashcamRecording 
                ? "bg-red-500 text-white animate-pulse" 
                : "bg-slate-800/80 text-gray-400 hover:text-white"
            }`}
          >
            <Camera className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 bg-slate-800/80 text-gray-400 hover:text-white rounded-full shadow-lg transition-all"
          >
            <MessageSquare className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Notifications Panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed top-20 right-4 w-80 bg-slate-800/90 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-4 max-h-96 overflow-y-auto z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Live Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border ${
                      notif.type === "alert"
                        ? "bg-red-500/10 border-red-500/30"
                        : notif.type === "success"
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-blue-500/10 border-blue-500/30"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{notif.title}</p>
                        <p className="text-xs text-gray-400">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.timestamp?.toLocaleTimeString()}</p>
                      </div>
                      <button
                        onClick={() => clearNotification(notif.id)}
                        className="text-gray-400 hover:text-white ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}