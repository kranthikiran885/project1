"use client"

import { authService } from './auth-service'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

class DataService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (response.ok) {
        return { success: true, data }
      } else {
        return { success: false, error: data.error || 'Request failed' }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Dashboard Stats
  async getDashboardStats() {
    return this.request('/api/dashboard/stats')
  }

  async getRealtimeStats() {
    return this.request('/api/dashboard/realtime-stats')
  }

  async getAnalytics(period = 'week') {
    return this.request(`/api/dashboard/analytics?period=${period}`)
  }

  // User Management
  async getAllUsers() {
    return this.request('/api/admin/users')
  }

  async getUsersByRole(role) {
    return this.request(`/api/admin/users?role=${role}`)
  }

  async updateUserStatus(userId, status) {
    return this.request(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  }

  // Vehicle Management
  async getVehicles() {
    return this.request('/api/vehicles')
  }

  async getVehicleById(id) {
    return this.request(`/api/vehicles/${id}`)
  }

  async createVehicle(vehicleData) {
    return this.request('/api/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData)
    })
  }

  async updateVehicle(id, vehicleData) {
    return this.request(`/api/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData)
    })
  }

  async deleteVehicle(id) {
    return this.request(`/api/vehicles/${id}`, {
      method: 'DELETE'
    })
  }

  async updateVehicleLocation(id, location) {
    return this.request(`/api/vehicles/${id}/location`, {
      method: 'PUT',
      body: JSON.stringify(location)
    })
  }

  // Route Management
  async getRoutes() {
    return this.request('/api/routes')
  }

  async getRouteById(id) {
    return this.request(`/api/routes/${id}`)
  }

  async createRoute(routeData) {
    return this.request('/api/routes', {
      method: 'POST',
      body: JSON.stringify(routeData)
    })
  }

  async updateRoute(id, routeData) {
    return this.request(`/api/routes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(routeData)
    })
  }

  async optimizeRoute(id) {
    return this.request(`/api/routes/${id}/optimize`, {
      method: 'POST'
    })
  }

  // Trip Management
  async getTrips() {
    return this.request('/api/trips')
  }

  async getTripById(id) {
    return this.request(`/api/trips/${id}`)
  }

  async getActiveTrips() {
    return this.request('/api/trips?status=active')
  }

  async createTrip(tripData) {
    return this.request('/api/trips', {
      method: 'POST',
      body: JSON.stringify(tripData)
    })
  }

  async startTrip(id) {
    return this.request(`/api/trips/${id}/start`, {
      method: 'PUT'
    })
  }

  async endTrip(id) {
    return this.request(`/api/trips/${id}/end`, {
      method: 'PUT'
    })
  }

  async boardStudent(tripId, studentData) {
    return this.request(`/api/trips/${tripId}/board`, {
      method: 'POST',
      body: JSON.stringify(studentData)
    })
  }

  // Payment Management
  async getPayments() {
    return this.request('/api/payments')
  }

  async getPaymentHistory(userId) {
    return this.request(`/api/payments/history${userId ? `?userId=${userId}` : ''}`)
  }

  async createPayment(paymentData) {
    return this.request('/api/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    })
  }

  async processPayment(id, paymentDetails) {
    return this.request(`/api/payments/${id}/process`, {
      method: 'PUT',
      body: JSON.stringify(paymentDetails)
    })
  }

  async generateInvoice(paymentId) {
    return this.request(`/api/payments/${paymentId}/invoice`)
  }

  // Emergency & Safety
  async getEmergencyAlerts() {
    return this.request('/api/emergency/alerts')
  }

  async createEmergencyAlert(alertData) {
    return this.request('/api/emergency/alert', {
      method: 'POST',
      body: JSON.stringify(alertData)
    })
  }

  async resolveAlert(id, resolution) {
    return this.request(`/api/emergency/alerts/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ resolution })
    })
  }

  // Analytics
  async getAnalytics(period = 'week') {
    return this.request(`/api/admin/analytics?period=${period}`)
  }

  async getRouteAnalytics(routeId) {
    return this.request(`/api/routes/${routeId}/analytics`)
  }

  async getVehicleAnalytics(vehicleId) {
    return this.request(`/api/vehicles/${vehicleId}/analytics`)
  }

  // Reports
  async getDailyReport(date) {
    return this.request(`/api/admin/reports/daily${date ? `?date=${date}` : ''}`)
  }

  async getMonthlyReport(month, year) {
    return this.request(`/api/admin/reports/monthly?month=${month}&year=${year}`)
  }

  async getCustomReport(filters) {
    return this.request('/api/admin/reports/custom', {
      method: 'POST',
      body: JSON.stringify(filters)
    })
  }

  // Notifications
  async getNotifications() {
    return this.request('/api/notifications')
  }

  async markNotificationRead(id) {
    return this.request(`/api/notifications/${id}/read`, {
      method: 'PUT'
    })
  }

  async sendNotification(notificationData) {
    return this.request('/api/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    })
  }
}

export const dataService = new DataService()