"use client"

/**
 * API Service - Centralized URL builder and fetch wrapper
 * Prevents double slashes and handles common API patterns
 */

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  return url.replace(/\/$/, '') // Remove trailing slash
}

/**
 * Build a safe API endpoint URL
 * @param {string} endpoint - API path (e.g., '/api/auth/login')
 * @returns {string} Full API URL with no double slashes
 */
export const buildApiUrl = (endpoint) => {
  const base = getBaseUrl()
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${base}${path}`
}

/**
 * Make an API request with error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint)
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `API Error: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message)
    throw error
  }
}

/**
 * Auth API calls
 */
export const authApi = {
  checkEmail: (email) => apiRequest('/api/auth/check-email', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),

  checkPhone: (phone) => apiRequest('/api/auth/check-phone', {
    method: 'POST',
    body: JSON.stringify({ phone })
  }),

  register: (userData) => apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  login: (email, password) => apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),

  getProfile: (token) => apiRequest('/api/auth/profile', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  }),

  updateProfile: (data, token) => apiRequest('/api/auth/profile', {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  })
}

export default { buildApiUrl, apiRequest, authApi }
