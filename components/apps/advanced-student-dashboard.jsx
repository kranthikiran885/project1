"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LogOut, MapPin, Clock, Users, BookOpen, Calendar, Bell, Settings, Star, Award,
  TrendingUp, Activity, BarChart3, MessageSquare, Heart, Share2, Camera, Mic,
  Navigation, Route, AlertCircle, CheckCircle, Phone, Shield, Zap, Target,
  Coffee, Gamepad2, Music, Headphones, Smartphone, Wifi, Battery, Signal,
  Sun, Moon, CloudRain, Wind, Thermometer, Eye, EyeOff, Volume2, VolumeX,
  Download, Upload, RefreshCw, Search, Filter, SortAsc, Plus, X, ChevronDown,
  Home, School, Bus, UserCheck, Clock3, MapIcon, Compass, Radio, Bluetooth,
  CreditCard, Wallet, PiggyBank, TrendingDown, Calculator, FileText, Bookmark
} from "lucide-react"
import { useRealTimeData } from "@/hooks/useRealTimeData"
import { useSocket } from "@/components/realtime/socket-integration"

export default function AdvancedStudentDashboard({ userData, onLogout }) {
  const [activeTab, setActiveTab] = useState("home")
  const [showNotifications, setShowNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [busTracking, setBusTracking] = useState(true)
  const [studyMode, setStudyMode] = useState(false)
  const [socialMode, setSocialMode] = useState(true)
  const [aiTutor, setAiTutor] = useState(false)
  const [quickActions, setQuickActions] = useState(false)
  const [weatherWidget, setWeatherWidget] = useState(true)

  const { trips, loading, error } = useRealTimeData()
  const { connected, notifications, clearNotification } = useSocket()

  const [busInfo, setBusInfo] = useState({
    busNumber: "B-42",
    driverName: "John Smith",
    currentLocation: "Main Street Junction",
    eta: "8 mins",
    nextStop: "College Gate",
    speed: 35,
    capacity: "28/40",
    status: "On Route",
    delay: 0,
    distance: "2.3 km"
  })

  const [academicData, setAcademicData] = useState({
    currentGPA: 3.8,
    attendance: 92,
    assignments: { pending: 3, completed: 15, overdue: 1 },
    exams: { upcoming: 2, completed: 8 },
    courses: [
      { name: "Computer Science", grade: "A", progress: 85, credits: 4 },
      { name: "Mathematics", grade: "B+", progress: 78, credits: 3 },
      { name: "Physics", grade: "A-", progress: 90, credits: 4 },
      { name: "English", grade: "B", progress: 72, credits: 2 }
    ]
  })

  const [socialData, setSocialData] = useState({
    friends: 24,
    studyGroups: 3,
    events: 5,
    messages: 12,
    achievements: [
      { title: "Perfect Attendance", icon: "🎯", date: "This Month" },
      { title: "Top Performer", icon: "🏆", date: "Last Week" },
      { title: "Study Streak", icon: "🔥", date: "7 Days" }
    ]
  })

  const [financialData, setFinancialData] = useState({
    balance: 2450,
    monthlySpent: 890,
    budget: 1200,
    transactions: [
      { type: "Transport", amount: -45, date: "Today" },
      { type: "Cafeteria", amount: -25, date: "Yesterday" },
      { type: "Books", amount: -120, date: "2 days ago" }
    ]
  })

  const [weatherData, setWeatherData] = useState({
    temp: 24,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    uvIndex: 6,
    forecast: [
      { day: "Today", temp: "24°C", icon: "⛅" },
      { day: "Tomorrow", temp: "26°C", icon: "☀️" },
      { day: "Wed", temp: "22°C", icon: "🌧️" }
    ]
  })

  const [quickActionsList, setQuickActionsList] = useState([
    { id: 1, title: "Mark Attendance", icon: UserCheck, color: "bg-green-500" },
    { id: 2, title: "View Timetable", icon: Calendar, color: "bg-blue-500" },
    { id: 3, title: "Submit Assignment", icon: Upload, color: "bg-purple-500" },
    { id: 4, title: "Join Study Group", icon: Users, color: "bg-orange-500" },
    { id: 5, title: "Book Transport", icon: Bus, color: "bg-cyan-500" },
    { id: 6, title: "Pay Fees", icon: CreditCard, color: "bg-pink-500" }
  ])

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "transport", label: "Transport", icon: Bus },
    { id: "academics", label: "Academics", icon: BookOpen },
    { id: "social", label: "Social", icon: Users },
    { id: "finance", label: "Finance", icon: Wallet },
    { id: "profile", label: "Profile", icon: Settings }
  ]

  const handleQuickAction = (actionId) => {
    console.log(`Quick action ${actionId} triggered`)
    // Implement quick action logic
  }

  const handleEmergencyContact = () => {
    // Emergency contact functionality
    console.log("Emergency contact initiated")
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} pt-20 pb-20`}>
      <div className="max-w-7xl mx-auto p-4">
        {/* Advanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6 mb-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-3`}>
                Welcome back, {userData.name}! 
                <span className="text-2xl">🎓</span>
                {connected && <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>}
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Student ID: {userData.studentId || 'STU2024001'} • Computer Science</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-lg transition-all ${darkMode ? 'hover:bg-yellow-500/20 text-yellow-400' : 'hover:bg-gray-200 text-gray-600'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setAiTutor(!aiTutor)}
                className={`p-3 rounded-lg transition-all ${aiTutor ? (darkMode ? "bg-cyan-500/20 text-cyan-400" : "bg-cyan-100 text-cyan-600") : (darkMode ? "hover:bg-cyan-500/20 text-cyan-400" : "hover:bg-cyan-100 text-cyan-600")}`}
              >
                <Zap className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-3 rounded-lg transition-all ${darkMode ? 'hover:bg-cyan-500/20 text-cyan-400' : 'hover:bg-cyan-100 text-cyan-600'}`}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={onLogout}
                className={`p-3 rounded-lg transition-all ${darkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'}`}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-white/60'} rounded-lg p-3 text-center`}>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>GPA</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{academicData.currentGPA}</p>
            </div>
            <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-white/60'} rounded-lg p-3 text-center`}>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Attendance</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{academicData.attendance}%</p>
            </div>
            <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-white/60'} rounded-lg p-3 text-center`}>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bus ETA</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{busInfo.eta}</p>
            </div>
            <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-white/60'} rounded-lg p-3 text-center`}>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Balance</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>₹{financialData.balance}</p>
            </div>
            <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-white/60'} rounded-lg p-3 text-center`}>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Friends</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>{socialData.friends}</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-2 mb-6`}>
          <div className="flex overflow-x-auto gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? (darkMode ? "bg-purple-500/30 text-purple-300 border border-purple-400/50" : "bg-purple-100 text-purple-700 border border-purple-300")
                    : (darkMode ? "hover:bg-slate-700/50 text-gray-400" : "hover:bg-gray-100 text-gray-600")
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "home" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActionsList.map((action) => (
                      <motion.button
                        key={action.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickAction(action.id)}
                        className={`${action.color} p-4 rounded-xl text-white text-center transition-all hover:shadow-lg`}
                      >
                        <action.icon className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm font-medium">{action.title}</p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Today's Schedule */}
                <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Today's Schedule
                  </h3>
                  <div className="space-y-3">
                    {[
                      { time: "09:00", subject: "Computer Science", room: "Lab-A", type: "lecture" },
                      { time: "11:00", subject: "Mathematics", room: "Room-201", type: "tutorial" },
                      { time: "14:00", subject: "Physics", room: "Lab-B", type: "practical" },
                      { time: "16:00", subject: "Study Group", room: "Library", type: "group" }
                    ].map((item, index) => (
                      <div key={index} className={`flex items-center gap-3 p-3 ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg`}>
                        <div className={`w-12 h-12 rounded-lg ${item.type === 'lecture' ? 'bg-blue-500/20 text-blue-400' : item.type === 'tutorial' ? 'bg-green-500/20 text-green-400' : item.type === 'practical' ? 'bg-orange-500/20 text-orange-400' : 'bg-purple-500/20 text-purple-400'} flex items-center justify-center`}>
                          <Clock className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.subject}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.time} • {item.room}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Weather & Achievements */}
                <div className="space-y-6">
                  {/* Weather Widget */}
                  <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                      <Sun className="w-5 h-5 text-yellow-500" />
                      Weather
                    </h3>
                    <div className="text-center">
                      <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{weatherData.temp}°C</p>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>{weatherData.condition}</p>
                      <div className="flex justify-between text-sm">
                        {weatherData.forecast.map((day, index) => (
                          <div key={index} className="text-center">
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{day.day}</p>
                            <p className="text-2xl my-1">{day.icon}</p>
                            <p className={`${darkMode ? 'text-white' : 'text-gray-800'} font-medium`}>{day.temp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Recent Achievements */}
                  <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                      <Award className="w-5 h-5 text-yellow-500" />
                      Achievements
                    </h3>
                    <div className="space-y-3">
                      {socialData.achievements.map((achievement, index) => (
                        <div key={index} className={`flex items-center gap-3 p-3 ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg`}>
                          <span className="text-2xl">{achievement.icon}</span>
                          <div className="flex-1">
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{achievement.title}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{achievement.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {activeTab === "transport" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Bus Tracking */}
                <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                    <Bus className="w-5 h-5 text-blue-500" />
                    Live Bus Tracking
                  </h3>
                  <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-xl p-4 mb-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Bus {busInfo.busNumber}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Driver: {busInfo.driverName}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${busInfo.status === 'On Route' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {busInfo.status}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Location:</span>
                        <span className={`${darkMode ? 'text-white' : 'text-gray-800'} font-medium`}>{busInfo.currentLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ETA:</span>
                        <span className={`${darkMode ? 'text-cyan-400' : 'text-cyan-600'} font-bold`}>{busInfo.eta}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Next Stop:</span>
                        <span className={`${darkMode ? 'text-white' : 'text-gray-800'} font-medium`}>{busInfo.nextStop}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Capacity:</span>
                        <span className={`${darkMode ? 'text-orange-400' : 'text-orange-600'} font-medium`}>{busInfo.capacity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      Track Live
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={handleEmergencyContact}
                      className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      Emergency
                    </motion.button>
                  </div>
                </motion.div>

                {/* Route Information */}
                <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                    <Route className="w-5 h-5 text-green-500" />
                    Route Information
                  </h3>
                  <div className="space-y-4">
                    {[
                      { stop: "Home", time: "07:30", status: "completed" },
                      { stop: "Main Junction", time: "07:45", status: "completed" },
                      { stop: "City Center", time: "08:00", status: "current" },
                      { stop: "College Gate", time: "08:15", status: "upcoming" },
                      { stop: "Campus", time: "08:20", status: "upcoming" }
                    ].map((stop, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${stop.status === 'completed' ? 'bg-green-500' : stop.status === 'current' ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        <div className="flex-1">
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stop.stop}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stop.time}</p>
                        </div>
                        {stop.status === 'current' && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Current</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "academics" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Academic Overview */}
                <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                    <BookOpen className="w-5 h-5 text-purple-500" />
                    Academic Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{academicData.currentGPA}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current GPA</p>
                    </div>
                    <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{academicData.attendance}%</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Attendance</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {academicData.courses.map((course, index) => (
                      <div key={index} className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
                        <div className="flex justify-between items-center mb-2">
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{course.name}</p>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${course.grade.startsWith('A') ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {course.grade}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className={`flex-1 ${darkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded-full h-2 mr-3`}>
                            <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                          </div>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{course.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Assignments & Exams */}
                <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                    <FileText className="w-5 h-5 text-orange-500" />
                    Assignments & Exams
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
                      <p className={`text-lg font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{academicData.assignments.pending}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                    </div>
                    <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
                      <p className={`text-lg font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{academicData.assignments.overdue}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overdue</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { title: "Data Structures Project", subject: "Computer Science", due: "Tomorrow", priority: "high" },
                      { title: "Calculus Assignment", subject: "Mathematics", due: "3 days", priority: "medium" },
                      { title: "Physics Lab Report", subject: "Physics", due: "1 week", priority: "low" }
                    ].map((assignment, index) => (
                      <div key={index} className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{assignment.title}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{assignment.subject}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${assignment.priority === 'high' ? 'text-red-400' : assignment.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                              Due: {assignment.due}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Social Stats */}
                <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                    <Users className="w-5 h-5 text-pink-500" />
                    Social Network
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>{socialData.friends}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Friends</p>
                    </div>
                    <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{socialData.studyGroups}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Study Groups</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Alex Johnson", status: "online", activity: "Studying Math", avatar: "👨‍🎓" },
                      { name: "Sarah Wilson", status: "away", activity: "In Library", avatar: "👩‍🎓" },
                      { name: "Mike Chen", status: "online", activity: "CS Project", avatar: "👨‍💻" }
                    ].map((friend, index) => (
                      <div key={index} className={`flex items-center gap-3 p-3 ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg`}>
                        <div className="relative">
                          <span className="text-2xl">{friend.avatar}</span>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 ${darkMode ? 'border-slate-700' : 'border-white'} ${friend.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{friend.name}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{friend.activity}</p>
                        </div>
                        <MessageSquare className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} cursor-pointer hover:text-blue-500`} />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Study Groups & Events */}
                <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Study Groups & Events
                  </h3>
                  <div className="space-y-4">
                    {[
                      { title: "CS Study Group", time: "Today 4:00 PM", members: 8, type: "study" },
                      { title: "Math Tutoring", time: "Tomorrow 2:00 PM", members: 12, type: "tutoring" },
                      { title: "Tech Meetup", time: "Friday 6:00 PM", members: 25, type: "event" },
                      { title: "Project Discussion", time: "Saturday 10:00 AM", members: 5, type: "project" }
                    ].map((group, index) => (
                      <div key={index} className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{group.title}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{group.time}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${group.type === 'study' ? 'bg-blue-500/20 text-blue-400' : group.type === 'tutoring' ? 'bg-green-500/20 text-green-400' : group.type === 'event' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'}`}>
                            {group.members} members
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${darkMode ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                        >
                          Join Group
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "finance" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Financial Overview */}
                <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                    <Wallet className="w-5 h-5 text-green-500" />
                    Financial Overview
                  </h3>
                  <div className={`${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-xl p-4 mb-4`}>
                    <div className="text-center mb-4">
                      <p className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>₹{financialData.balance}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Available Balance</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className={`text-lg font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>₹{financialData.monthlySpent}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>This Month</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>₹{financialData.budget}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Budget</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Money
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay Fees
                    </motion.button>
                  </div>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                    <Activity className="w-5 h-5 text-purple-500" />
                    Recent Transactions
                  </h3>
                  <div className="space-y-3">
                    {financialData.transactions.map((transaction, index) => (
                      <div key={index} className={`flex items-center gap-3 p-3 ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg`}>
                        <div className={`w-10 h-10 rounded-lg ${transaction.amount < 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'} flex items-center justify-center`}>
                          {transaction.type === 'Transport' ? <Bus className="w-5 h-5" /> : 
                           transaction.type === 'Cafeteria' ? <Coffee className="w-5 h-5" /> : 
                           <BookOpen className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{transaction.type}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{transaction.date}</p>
                        </div>
                        <p className={`font-bold ${transaction.amount < 0 ? 'text-red-400' : 'text-green-400'}`}>
                          {transaction.amount < 0 ? '-' : '+'}₹{Math.abs(transaction.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className={`w-full mt-4 py-3 rounded-lg text-sm font-medium transition-all ${darkMode ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                  >
                    View All Transactions
                  </motion.button>
                </motion.div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Information */}
                <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                    <Settings className="w-5 h-5 text-gray-500" />
                    Profile Settings
                  </h3>
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                      {userData.name?.charAt(0) || 'S'}
                    </div>
                    <h4 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{userData.name}</h4>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Computer Science Student</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Student ID", value: userData.studentId || "STU2024001" },
                      { label: "Email", value: userData.email || "student@college.edu" },
                      { label: "Phone", value: userData.phone || "+91 98765 43210" },
                      { label: "Year", value: "3rd Year" },
                      { label: "Department", value: "Computer Science" }
                    ].map((item, index) => (
                      <div key={index} className={`flex justify-between items-center p-3 ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg`}>
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.label}:</span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Preferences */}
                <motion.div className={`${darkMode ? 'bg-slate-800/40' : 'bg-white/80'} backdrop-blur-lg border ${darkMode ? 'border-purple-500/30' : 'border-purple-200'} rounded-2xl p-6`}>
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center gap-2`}>
                    <Bell className="w-5 h-5 text-blue-500" />
                    Preferences
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Dark Mode", enabled: darkMode, toggle: () => setDarkMode(!darkMode) },
                      { label: "Bus Tracking", enabled: busTracking, toggle: () => setBusTracking(!busTracking) },
                      { label: "Study Mode", enabled: studyMode, toggle: () => setStudyMode(!studyMode) },
                      { label: "Social Features", enabled: socialMode, toggle: () => setSocialMode(!socialMode) },
                      { label: "Weather Widget", enabled: weatherWidget, toggle: () => setWeatherWidget(!weatherWidget) }
                    ].map((pref, index) => (
                      <div key={index} className={`flex justify-between items-center p-3 ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'} rounded-lg`}>
                        <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{pref.label}</span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={pref.toggle}
                          className={`w-12 h-6 rounded-full transition-all ${pref.enabled ? 'bg-green-500' : (darkMode ? 'bg-gray-600' : 'bg-gray-300')}`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-all ${pref.enabled ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* AI Assistant Panel */}
        <AnimatePresence>
          {aiTutor && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 right-6 w-80 h-96 bg-slate-800/95 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-4 z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  AI Study Assistant
                </h4>
                <button onClick={() => setAiTutor(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-64 bg-slate-700/50 rounded-lg p-3 mb-3 overflow-y-auto">
                <div className="space-y-3">
                  <div className="bg-cyan-500/20 text-cyan-300 p-2 rounded-lg text-sm">
                    Hi! I'm your AI study assistant. How can I help you today?
                  </div>
                  <div className="bg-slate-600/50 text-white p-2 rounded-lg text-sm ml-8">
                    Can you help me with my CS assignment?
                  </div>
                  <div className="bg-cyan-500/20 text-cyan-300 p-2 rounded-lg text-sm">
                    Of course! What specific topic in Computer Science are you working on?
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
                <button className="bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-lg transition-all">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setQuickActions(!quickActions)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg z-40"
        >
          <Plus className={`w-6 h-6 transition-transform ${quickActions ? 'rotate-45' : ''}`} />
        </motion.button>

        {/* Quick Actions Menu */}
        <AnimatePresence>
          {quickActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-24 right-6 space-y-3 z-30"
            >
              {[
                { icon: Phone, label: "Emergency", color: "bg-red-500" },
                { icon: MessageSquare, label: "Support", color: "bg-blue-500" },
                { icon: MapPin, label: "Track Bus", color: "bg-green-500" },
                { icon: Calendar, label: "Schedule", color: "bg-purple-500" }
              ].map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg`}
                >
                  <action.icon className="w-5 h-5" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}