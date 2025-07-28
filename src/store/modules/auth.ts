import { defineStore } from 'pinia'
import type { LoginRequest, AuthState } from '@/types/auth'
import { authService } from '@/services/auth.service'

/**
 * Maneja el estado de autenticación del usuario, incluyendo login, logout,
 * y verificación de estado de autenticación. Utiliza localStorage para
 * persistir el token de autenticación entre sesiones.
 */
export const useAuthStore = defineStore('auth', {
 
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('auth-token'),
    isAuthenticated: false, 
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.roles?.includes('ADMIN') || false
  },

  actions: {
    /**
     * Autentica un usuario con credenciales
     */
    async login(credentials: LoginRequest) {
      this.loading = true
      this.error = null

      try {
        const response = await authService.login(credentials)
        
        this.token = response.data.token
        this.user = response.data.user
        
        localStorage.setItem('auth-token', response.data.token)
        
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
     * 
     */
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth-token')
      this.error = null
    },

    /**
     * Inicializa la autenticación al cargar la aplicación
     */
    async initAuth() {
      if (this.token) {
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