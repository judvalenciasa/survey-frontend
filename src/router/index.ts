/**
 * Configuración principal del router Vue
 * @description Combina todas las rutas y configura la navegación de la aplicación
 * @module Router Configuration
 */
import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'
import publicRoutes from './routes/public'
import authRoutes from './routes/auth'
import adminRoutes from './routes/admin'

/**
 * Combina todas las rutas de la aplicación
 * @description Unifica rutas públicas, de autenticación y administrativas
 */
const routes = [
  ...publicRoutes,
  ...authRoutes,
  ...adminRoutes
]

/**
 * Instancia del router configurada con historial web
 * @description Router principal de Vue con todas las rutas registradas
 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * Aplicación de guardias de navegación globales
 * @description Protege rutas según estado de autenticación y permisos
 */
router.beforeEach(authGuard)

export default router