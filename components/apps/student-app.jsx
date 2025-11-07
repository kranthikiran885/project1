"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LogOut,
  MapPin,
  Clock,
  Bus,
  AlertCircle,
  QrCode,
  Heart,
  Users,
  Star,
  Navigation,
  Phone,
  TrendingUp,
  Ticket,
  MessageCircle,
  Zap,
  Award,
  Bell,
  Settings,
  X,
  Check,
  ChevronRight,
  Share2,
  Download,
  Calendar,
  Gauge,
  DollarSign,
  Wallet,
  History,
  Map,
  Shield,
} from "lucide-react"
import SocketListener from "../notifications/socket-listener"
import { dataService } from "../../lib/data-service"

export default function StudentApp({ userData, onLogout }) {
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const [bookingStep, setBookingStep] = useState("list")
  const [favorites, setFavorites] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [trips, setTrips] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userBookings, setUserBookings] = useState([])
  const [userPayments, setUserPayments] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [vehiclesRes, tripsRes, routesRes, paymentsRes] = await Promise.all([
          dataService.getVehicles(),
          dataService.getTrips(),
          dataService.getRoutes(),
          dataService.getPaymentHistory(userData.id)
        ])
        
        if (vehiclesRes.success) setVehicles(vehiclesRes.data)
        if (tripsRes.success) setTrips(tripsRes.data)
        if (routesRes.success) setRoutes(routesRes.data)
        if (paymentsRes.success) setUserPayments(paymentsRes.data)
      } catch (err) {
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [userData.id])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [ratings, setRatings] = useState({})
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [activeTab, setActiveTab] = useState("trips")

  const getAvailableTrips = () => {
    return routes.map(route => {
      const vehicle = vehicles.find(v => v.route === route._id && v.status === 'active')
      return {
        id: route._id,
        route: route.name,
        departure: route.scheduleAM?.startTime || '08:00',
        arrival: route.scheduleAM?.endTime || '09:00',
        bus: vehicle?.registrationNumber || 'N/A',
        status: 'on-time',
        driver: vehicle?.driver?.name || 'Assigned Driver',
        driverRating: 4.5,
        occupancy: vehicle?.currentOccupancy || 0,
        capacity: vehicle?.capacity || 50,
        rating: 4.5,
        image: '/gps-tracking-map-interface.jpg',
        price: route.fare || 150,
        stops: route.stops?.length || 0,
        amenities: ['WiFi', 'GPS Tracking'],
        vehicle: vehicle
      }
    }).filter(trip => trip.vehicle)
  }

  const upcomingTrips = getAvailableTrips()

  const bookedTrips = userBookings

  const pastTrips = trips.filter(trip => 
    trip.status === 'completed' && 
    trip.studentsBoarded?.includes(userData.id)
  ).map(trip => ({
    id: trip._id,
    route: trip.route?.name || 'Unknown Route',
    departure: trip.startTime ? new Date(trip.startTime).toLocaleTimeString() : 'N/A',
    arrival: trip.endTime ? new Date(trip.endTime).toLocaleTimeString() : 'N/A',
    bus: trip.vehicle?.registrationNumber || 'N/A',
    date: trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : 'N/A',
    driver: trip.driver?.name || 'Unknown Driver',
    rating: 4.5,
    yourRating: null
  }))

  const notifications = [
    { id: 1, type: "success", title: "Booking Confirmed", message: "Your seat C-12 on Route A1 is confirmed", time: "5 mins ago" },
    { id: 2, type: "alert", title: "Payment Due", message: "Pay ₹150 for Route A2 booking", time: "2 hours ago" },
    { id: 3, type: "info", title: "Driver Update", message: "Driver John is 5 mins away", time: "10 mins ago" },
    { id: 4, type: "success", title: "Trip Completed", message: "Thanks for traveling with us!", time: "Yesterday" },
  ]

  const walletData = {
    balance: 2500,
    spent: userPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0),
    trips: pastTrips.length,
    rewards: Math.floor(pastTrips.length * 20),
  }

  const toggleFavorite = (tripId) => {
    setFavorites((fav) => (fav.includes(tripId) ? fav.filter((f) => f !== tripId) : [...fav, tripId]))
  }

  const handleBookTrip = async (trip) => {
    setSelectedTrip(trip)
    setShowPaymentModal(true)
  }

  const confirmBooking = async () => {
    if (!selectedTrip) return
    
    try {
      const bookingData = {
        route: selectedTrip.id,
        vehicle: selectedTrip.vehicle._id,
        user: userData.id,
        amount: selectedTrip.price,
        status: 'confirmed'
      }
      
      const result = await dataService.createPayment(bookingData)
      if (result.success) {
        setUserBookings([...userBookings, {
          ...selectedTrip,
          bookingId: result.data._id,
          paid: true,
          seat: `S-${Math.floor(Math.random() * 50) + 1}`
        }])
        setShowPaymentModal(false)
        setActiveTab('booked')
      }
    } catch (err) {
      console.error('Booking failed:', err)
    }
  }

  const handleRateTrip = (tripId) => {
    setRatings({ ...ratings, [tripId]: 0 })
    setShowRatingModal(tripId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <SocketListener>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-20">
        <div className="max-w-6xl mx-auto p-4">
        {/* Header with Notifications */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {userData.name}! 🚌</h1>
            <p className="text-gray-400 mt-1">Book your next ride and track in real-time</p>
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
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-slate-800/50 border border-purple-500/30 rounded-2xl p-4 max-h-64 overflow-y-auto"
            >
              <h3 className="text-lg font-bold text-white mb-3">Notifications</h3>
              <div className="space-y-2">
                {notifications.map((notif) => (
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
                      <p className="font-semibold text-white text-sm">{notif.title}</p>
                      <p className="text-xs text-gray-400">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wallet & Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6"
        >
          <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-cyan-400" />
              <p className="text-xs text-gray-400">Wallet Balance</p>
            </div>
            <p className="text-2xl font-bold text-cyan-400">₹{walletData.balance}</p>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <p className="text-xs text-gray-400">Total Spent</p>
            </div>
            <p className="text-2xl font-bold text-orange-400">₹{walletData.spent}</p>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Bus className="w-4 h-4 text-green-400" />
              <p className="text-xs text-gray-400">Trips Completed</p>
            </div>
            <p className="text-2xl font-bold text-green-400">{walletData.trips}</p>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-purple-400" />
              <p className="text-xs text-gray-400">Reward Points</p>
            </div>
            <p className="text-2xl font-bold text-purple-400">+{walletData.rewards}</p>
          </motion.div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-800/50 p-2 rounded-lg border border-purple-500/30 overflow-x-auto">
          {[
            { id: "trips", label: "Available", icon: Bus },
            { id: "booked", label: "My Bookings", icon: Ticket },
            { id: "history", label: "Trip History", icon: History },
            { id: "wallet", label: "Wallet", icon: Wallet },
          ].map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveTab(id)
                if (id === "trips" || id === "booked") setBookingStep(id === "trips" ? "list" : "booked")
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </motion.button>
          ))}
        </div>

        {/* Trips Tab */}
        {activeTab === "trips" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Available Trips Today</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {upcomingTrips.map((trip, idx) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  whileHover={{ y: -8 }}
                  className="bg-slate-800/50 border border-purple-500/30 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all flex flex-col h-full"
                >
                  {/* Trip Image */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={trip.image || "/placeholder.svg"}
                      alt={trip.route}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      ₹{trip.price}
                    </div>
                  </div>

                  {/* Trip Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-white text-lg">{trip.route}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {trip.driver}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        onClick={() => toggleFavorite(trip.id)}
                        className={`p-2 transition-all ${favorites.includes(trip.id) ? "text-orange-500" : "text-gray-500 hover:text-orange-400"}`}
                      >
                        <Heart className="w-5 h-5" fill={favorites.includes(trip.id) ? "currentColor" : "none"} />
                      </motion.button>
                    </div>

                    <div className="space-y-2 text-sm mb-4 flex-1">
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-cyan-400" /> {trip.departure} - {trip.arrival}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-semibold">{trip.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-cyan-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {trip.occupancy}/{trip.capacity} seats
                        </span>
                        <div className="w-20 h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-cyan-400"
                            style={{ width: `${(trip.occupancy / trip.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-1 flex-wrap mt-2">
                        {trip.amenities.map((amenity) => (
                          <span key={amenity} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBookTrip(trip)}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2"
                    >
                      <Ticket className="w-4 h-4" />
                      Book Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bookings Tab */}
        {activeTab === "booked" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">My Bookings</h2>
            <div className="space-y-4 mb-6">
              {bookedTrips.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-cyan-400/30 rounded-xl p-6 hover:border-cyan-400/60 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-white text-xl">{booking.route}</p>
                      <p className="text-sm text-gray-400">{booking.date}, {booking.departure}</p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${
                        booking.status === "confirmed"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Bus</p>
                      <p className="font-bold text-white">{booking.bus}</p>
                      <p className="text-xs text-gray-400 mt-1">{booking.driver}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Seat Number</p>
                      <p className="font-bold text-cyan-400 text-lg">{booking.seat}</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Price</p>
                      <p className="font-bold text-orange-400">₹{booking.price}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowQR(true)}
                      className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      Digital Pass
                    </motion.button>
                    {!booking.paid && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setShowPaymentModal(true)}
                        className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 py-2 rounded-lg font-semibold transition-all"
                      >
                        Pay Now
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-gray-300 py-2 rounded-lg font-semibold transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Trip History Tab */}
        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Trip History</h2>
            <div className="space-y-4 mb-6">
              {pastTrips.map((trip) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/60 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-white text-lg">{trip.route}</p>
                      <p className="text-sm text-gray-400">{trip.date} • {trip.departure} - {trip.arrival}</p>
                      <p className="text-xs text-gray-500 mt-1">{trip.driver}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">{trip.rating}</span>
                      </div>
                    </div>
                  </div>

                  {!trip.yourRating && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleRateTrip(trip.id)}
                      className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <Star className="w-4 h-4" />
                      Rate This Trip
                    </motion.button>
                  )}
                  {trip.yourRating && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
                      <p className="text-xs text-green-300">You rated: <span className="font-bold">{trip.yourRating}/5 ⭐</span></p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Wallet Tab */}
        {activeTab === "wallet" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">My Wallet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 rounded-xl p-6">
                <p className="text-gray-300 mb-2">Available Balance</p>
                <p className="text-4xl font-bold text-cyan-300">₹{walletData.balance}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 w-full bg-cyan-500/50 hover:bg-cyan-500/60 text-white py-2 rounded-lg font-semibold transition-all"
                >
                  Add Money
                </motion.button>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-orange-500/30 to-red-500/30 border border-orange-500/50 rounded-xl p-6">
                <p className="text-gray-300 mb-2">Total Spent</p>
                <p className="text-4xl font-bold text-orange-300">₹{walletData.spent}</p>
                <p className="text-xs text-gray-400 mt-4">on {walletData.trips} trips</p>
              </motion.div>
            </div>

            <h3 className="text-lg font-bold text-white mb-3">Recent Transactions</h3>
            <div className="space-y-2">
              {[
                { type: "debit", route: "Route A1", amount: 150, date: "Nov 6, 10:30 AM" },
                { type: "credit", amount: 100, date: "Nov 5, 3:00 PM", reason: "Cashback" },
                { type: "debit", route: "Route B1", amount: 120, date: "Nov 4, 8:15 AM" },
              ].map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                  <div>
                    <p className="text-white font-semibold text-sm">{tx.route || tx.reason}</p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                  <p className={`font-bold ${tx.type === "debit" ? "text-red-400" : "text-green-400"}`}>
                    {tx.type === "debit" ? "-" : "+"}₹{tx.amount}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQR(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Your Digital Pass</h3>
                  <button onClick={() => setShowQR(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl mb-6 flex items-center justify-center">
                  <svg className="w-48 h-48" viewBox="0 0 200 200">
                    <rect x="20" y="20" width="10" height="10" fill="black" />
                    <rect x="40" y="20" width="10" height="10" fill="black" />
                    <rect x="60" y="20" width="10" height="10" fill="black" />
                    <rect x="80" y="20" width="10" height="10" fill="black" />
                    <rect x="20" y="40" width="10" height="10" fill="black" />
                    <rect x="80" y="40" width="10" height="10" fill="black" />
                    <rect x="20" y="60" width="10" height="10" fill="black" />
                    <rect x="40" y="60" width="10" height="10" fill="black" />
                    <rect x="60" y="60" width="10" height="10" fill="black" />
                    <rect x="80" y="60" width="10" height="10" fill="black" />
                    <rect x="40" y="80" width="10" height="10" fill="black" />
                    <rect x="60" y="80" width="10" height="10" fill="black" />
                  </svg>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Booking ID:</span>
                    <span className="text-white font-bold">BK-2024-001</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Route:</span>
                    <span className="text-white font-bold">Route A1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Seat:</span>
                    <span className="text-cyan-400 font-bold">C-12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-white font-bold">08:00 - 08:45</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowQR(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold transition-all"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Book Your Seat</h3>
                  <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {selectedTrip && (
                  <>
                    <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl p-4 mb-6 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Route</span>
                        <span className="text-white font-bold">{selectedTrip.route}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time</span>
                        <span className="text-white font-bold">{selectedTrip.departure} - {selectedTrip.arrival}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bus</span>
                        <span className="text-white font-bold">{selectedTrip.bus}</span>
                      </div>
                      <div className="border-t border-purple-500/30 pt-3 flex justify-between">
                        <span className="text-gray-300">Price per seat</span>
                        <span className="text-orange-400 font-bold text-lg">₹{selectedTrip.price}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <label className="flex items-center gap-3 p-3 border border-purple-500/30 rounded-lg hover:border-purple-400/60 cursor-pointer transition-all">
                        <input type="radio" name="payment" value="wallet" defaultChecked className="w-4 h-4" />
                        <div>
                          <p className="text-white font-semibold">Wallet</p>
                          <p className="text-xs text-gray-400">Available: ₹{walletData.balance}</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 border border-purple-500/30 rounded-lg hover:border-purple-400/60 cursor-pointer transition-all">
                        <input type="radio" name="payment" value="card" className="w-4 h-4" />
                        <div>
                          <p className="text-white font-semibold">Credit/Debit Card</p>
                          <p className="text-xs text-gray-400">Visa, Mastercard</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 border border-purple-500/30 rounded-lg hover:border-purple-400/60 cursor-pointer transition-all">
                        <input type="radio" name="payment" value="upi" className="w-4 h-4" />
                        <div>
                          <p className="text-white font-semibold">UPI</p>
                          <p className="text-xs text-gray-400">Google Pay, PhonePe</p>
                        </div>
                      </label>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={confirmBooking}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                    >
                      <Check className="w-5 h-5" />
                      Confirm & Pay ₹{selectedTrip.price}
                    </motion.button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rating Modal */}
        <AnimatePresence>
          {showRatingModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRatingModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-800 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Rate Your Trip</h3>
                  <button onClick={() => setShowRatingModal(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-300 mb-4">How was your experience?</p>
                  <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-4xl transition-all"
                      >
                        {star <= (ratings[showRatingModal] || 0) ? "⭐" : "☆"}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Share your feedback... (optional)"
                  className="w-full bg-slate-700/50 border border-purple-500/30 rounded-lg p-3 text-white placeholder-gray-500 text-sm mb-4 resize-none"
                  rows="3"
                ></textarea>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowRatingModal(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-semibold transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Submit
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>
    </SocketListener>
  )
}

