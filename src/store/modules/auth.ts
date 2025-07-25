import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest } from '@/types/auth'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth-token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.roles?.includes('ADMIN') || false)

  // Acciones
  const login = async (credentials: LoginRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials)
      token.value = response.data.token
      user.value = response.data.user
      
      // Guardar token en localStorage
      localStorage.setItem('auth-token', response.data.token)
      
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error de autenticación'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth-token')
    error.value = null
  }

  const initAuth = async () => {
    if (token.value) {
      try {
        const response = await authService.getCurrentUser()
        user.value = response.data
      } catch (err) {
        logout() // Token inválido
      }
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    initAuth
  }
})