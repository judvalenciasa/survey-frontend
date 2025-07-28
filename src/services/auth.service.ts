/**
 * Servicio de autenticación de usuarios
 * @description Maneja las operaciones de login, logout y obtención de usuario actual
 * @module Auth Service
 */
import type { AxiosResponse } from 'axios'
import api from './api'
import type { LoginRequest, AuthResponse, User } from '@/types/auth'


class AuthService {
  /**
   * Autentica un usuario con sus credenciales
   * @param credentials - Datos de login (username y password)
   * @returns Respuesta con token y datos del usuario
   */
  async login(credentials: LoginRequest): Promise<AxiosResponse<AuthResponse>> {
    return api.post<AuthResponse>('/api/auth/login', credentials)
  }

  /**
   * Obtiene los datos del usuario autenticado actual
   * @returns Información completa del usuario logueado
   */
  async getCurrentUser(): Promise<AxiosResponse<User>> {
    return api.get<User>('/api/auth/me')
  }

  /**
   * Cierra la sesión del usuario en el servidor
   * @returns Confirmación del logout
   */
  async logout(): Promise<AxiosResponse<void>> {
    return api.post<void>('/api/auth/logout')
  }
}

/**
 * Instancia singleton del servicio de autenticación
 */
export const authService = new AuthService()