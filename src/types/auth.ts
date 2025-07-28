/**
 * Definiciones de tipos para autenticación de usuarios
 * @description Interfaces para manejo de usuarios, login y estados de autenticación
 * @module Authentication Types
 */

/**
 * Representa un usuario del sistema
 * @interface User
 */
export interface User {
    id: string
    username: string
    email: string
    firstName: string
    lastName: string
    roles: string[]
    active: boolean
  }
  
/**
 * Datos requeridos para iniciar sesión
 * @interface LoginRequest
 */
export interface LoginRequest {
    username: string
    password: string
  }
  
/**
 * Respuesta del servidor tras autenticación exitosa
 * @interface AuthResponse
 */
export interface AuthResponse {
    token: string
    user: User
  }
  
/**
 * Estado global de autenticación en el store
 * @interface AuthState
 */
export interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
  }

  