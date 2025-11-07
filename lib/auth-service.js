"use client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

class AuthService {
  constructor() {
    this.token = null
    this.user = null
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        this.token = data.token
        this.user = data.user
        localStorage.setItem('ctmsAuth', JSON.stringify({ token: data.token, user: data.user }))
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        this.token = data.token
        this.user = data.user
        localStorage.setItem('ctmsAuth', JSON.stringify({ token: data.token, user: data.user }))
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async getProfile() {
    try {
      const authData = this.getAuthData()
      if (!authData.token) return { success: false, error: 'No token found' }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authData.token}`,
        },
      })
      
      const data = await response.json()
      
      if (response.ok) {
        this.user = data
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async updateProfile(profileData) {
    try {
      const authData = this.getAuthData()
      if (!authData.token) return { success: false, error: 'No token found' }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.token}`,
        },
        body: JSON.stringify(profileData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        this.user = data.user
        const currentAuth = JSON.parse(localStorage.getItem('ctmsAuth') || '{}')
        localStorage.setItem('ctmsAuth', JSON.stringify({ ...currentAuth, user: data.user }))
        return { success: true, data }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  getAuthData() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ctmsAuth')
      if (stored) {
        const parsed = JSON.parse(stored)
        this.token = parsed.token
        this.user = parsed.user
        return parsed
      }
    }
    return { token: null, user: null }
  }

  isAuthenticated() {
    const authData = this.getAuthData()
    return !!authData.token
  }

  logout() {
    this.token = null
    this.user = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ctmsAuth')
    }
  }

  async checkEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      return await response.json()
    } catch (error) {
      return { exists: false, error: error.message }
    }
  }

  async checkPhone(phone) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/check-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      return await response.json()
    } catch (error) {
      return { exists: false, error: error.message }
    }
  }

  getAuthHeaders() {
    const authData = this.getAuthData()
    return authData.token ? { 'Authorization': `Bearer ${authData.token}` } : {}
  }
}

export const authService = new AuthService()