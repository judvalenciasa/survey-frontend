/**
 * Store de autenticación de usuarios
 * @description Maneja el estado de autenticación, login, logout y persistencia de tokens
 * @module Auth Store
 */
import { defineStore } from 'pinia'
import type { LoginRequest, AuthState } from '@/types/auth'
import { authService } from '@/services/auth.service'

/**
 * Store de autenticación que maneja el estado del usuario
 * @description Gestiona login, logout, verificación de estado y persistencia de tokens
 */
export const useAuthStore = defineStore('auth', {
 
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  getters: {
    /**
     * Determina si el usuario está autenticado
     */
    isAuthenticated: (state) => !!state.token,
    
    /**
     * Verifica si el usuario tiene rol de administrador
     */
    isAdmin: (state) => state.user?.roles?.includes('ADMIN') || false
  },

  actions: {
    /**
     * Autentica un usuario con sus credenciales
     * @param credentials - Datos de login del usuario
     * @returns Resultado de la operación
     */
    async login(credentials: LoginRequest) {
      this.loading = true
      this.error = null

      try {
        const response = await authService.login(credentials)
        
        this.token = response.data.token
        this.user = response.data.user
        
        return { success: true }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error de autenticación'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    /**
     * Cierra la sesión del usuario actual
     * @description Limpia el estado y remueve el token del localStorage
     */
    logout() {
      this.user = null
      this.token = null
      this.error = null
    },

    /**
     * Inicializa la autenticación al cargar la aplicación
     * @description Verifica si existe un token válido y restaura la sesión
     */
    async initAuth() {
      if (this.token && !this.user) {
        try {
          const response = await authService.getCurrentUser()
          this.user = response.data
        } catch (err) {
          this.logout()
        }
      }
    }
  }
})