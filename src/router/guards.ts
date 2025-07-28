/**
 * Guardias de navegación para protección de rutas
 * @description Controla el acceso a rutas según autenticación y permisos
 * @module Router Guards
 */
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'

/**
 * Guardian principal de autenticación y autorización
 * @param to - Ruta de destino
 * @param _from - Ruta de origen (no utilizada)
 * @param next - Función para continuar la navegación
 * @description Valida permisos de acceso y redirige según corresponda
 */
export const authGuard = async (
  to: RouteLocationNormalized, 
  _from: RouteLocationNormalized, 
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  if (to.meta.requiresGuest && authStore.token) {
    return next('/admin/dashboard')
  }

  if (to.meta.requiresAuth && !authStore.token) {
    return next('/auth/login')
  }

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