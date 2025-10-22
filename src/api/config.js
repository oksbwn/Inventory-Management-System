import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
})

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // Log requests in development
    if (import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true') {
      // console.log('API Request:', config.method?.toUpperCase(), config.url)
    }
    return config
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    // Log responses in development
    if (import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true') {
      // console.log('API Response:', response.status, response.config.url)
    }
    return response.data
  },
  error => {
    console.error('Response Error:', error.response?.status, error.message)
    
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 404:
          console.error('Resource not found')
          break
        case 500:
          console.error('Server error')
          break
        case 503:
          console.error('Service unavailable')
          break
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
