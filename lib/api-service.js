"use client"

import { authService } from './auth-service'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

class ApiService {
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

  // Vehicle APIs
  async getVehicles() {
    return this.request('/api/vehicles')
  }

  async getVehicle(id) {
    return this.request(`/api/vehicles/${id}`)
  }

  async createVehicle(vehicleData) {
    return this.request('/api/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    })
  }

  async updateVehicleLocation(id, locationData) {
    return this.request(`/api/vehicles/${id}/location`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    })
  }

  async updateVehicleStatus(id, status) {
    return this.request(`/api/vehicles/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // Trip APIs
  async getTrips() {
    return this.request('/api/trips')
  }

  async getTrip(id) {
    return this.request(`/api/trips/${id}`)
  }

  async createTrip(tripData) {
    return this.request('/api/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    })
  }

  async startTrip(id) {
    return this.request(`/api/trips/${id}/start`, {
      method: 'PUT',
    })
  }

  async endTrip(id) {
    return this.request(`/api/trips/${id}/end`, {
      method: 'PUT',
    })
  }

  async boardStudent(tripId, studentData) {
    return this.request(`/api/trips/${tripId}/board-student`, {
      method: 'POST',
      body: JSON.stringify(studentData),
    })
  }

  // Route APIs
  async getRoutes() {
    return this.request('/api/routes')
  }

  async getRoute(id) {
    return this.request(`/api/routes/${id}`)
  }

  async createRoute(routeData) {
    return this.request('/api/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    })
  }

  async optimizeRoute(id) {
    return this.request(`/api/routes/${id}/optimize`, {
      method: 'POST',
    })
  }

  async getRouteAnalytics(id) {
    return this.request(`/api/routes/${id}/analytics`)
  }

  // Payment APIs
  async createPayment(paymentData) {
    return this.request('/api/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    })
  }

  async getPaymentHistory() {
    return this.request('/api/payments/history')
  }

  async completePayment(id, transactionData) {
    return this.request(`/api/payments/${id}/complete`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    })
  }

  async generateInvoice(id) {
    return this.request(`/api/payments/${id}/invoice`)
  }

  // Emergency APIs
  async createEmergencyAlert(alertData) {
    return this.request('/api/emergency/alert', {
      method: 'POST',
      body: JSON.stringify(alertData),
    })
  }

  async getEmergencyAlerts() {
    return this.request('/api/emergency/alerts')
  }

  async resolveAlert(id, resolution) {
    return this.request(`/api/emergency/alerts/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ resolution }),
    })
  }

  // Admin APIs
  async getDashboardStats() {
    return this.request('/api/admin/dashboard')
  }

  async getAllUsers() {
    return this.request('/api/admin/users')
  }

  async getDailyReport() {
    return this.request('/api/admin/reports/daily')
  }

  async getMonthlyReport() {
    return this.request('/api/admin/reports/monthly')
  }
}

export const apiService = new ApiService()