/**
 * Configuración principal de Axios para comunicación con la API
 * @description Instancia configurada de Axios con interceptores de autenticación
 * @module API Configuration
 */
import axios, { type AxiosInstance } from 'axios'

/**
 * Instancia principal de Axios configurada para la aplicación
 * @description Incluye configuración base, timeout y headers por defecto
 */
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Interceptor de request que agrega automáticamente el token de autenticación
 * @description Obtiene el token del localStorage y lo incluye en las peticiones
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api