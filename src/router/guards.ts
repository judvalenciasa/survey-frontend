import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'

// Guard de autenticación y autorización
export const authGuard = async (
  to: RouteLocationNormalized, 
  _from: RouteLocationNormalized, 
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  // 1. Usuario autenticado tratando de acceder a login
  if (to.meta.requiresGuest && authStore.token) {
    return next('/admin/dashboard')
  }

  // 2. Ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.token) {
    return next('/auth/login')
  }

  // 3. Verificar rol de admin para rutas administrativas
  if (
    to.path.startsWith('/admin') &&
    authStore.token &&
    authStore.user &&
    !authStore.isAdmin
  ) {
    console.log('Usuario no es admin:', authStore.user)
    return next('/')
  }

  next()
}