import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://192.168.0.7:5678',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
})

apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default apiClient
