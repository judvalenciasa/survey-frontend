/**
 * Configuración principal de Axios para comunicación con la API
 */
import axios, { type AxiosInstance } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api'

/**
 * ✅ Cliente API público (sin autenticación) - PARA RESPONSES
 */
export const publicApi: AxiosInstance = axios.create({
  baseURL,
  timeout: 480000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * ✅ Cliente API autenticado (con token) - PARA ADMIN
 */
const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 480000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Interceptor SOLO para requests autenticadas (admin)
 */
api.interceptors.request.use((config) => {
  const persistedAuth = localStorage.getItem('pinia-auth')
  if (persistedAuth) {
    try {
      const authData = JSON.parse(persistedAuth)
      const token = authData.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.warn('Error al leer token desde persistencia:', error)
    }
  }
  return config
})

export default api