import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'
import publicRoutes from './routes/public'
import authRoutes from './routes/auth'
import adminRoutes from './routes/admin'

// Combinar todas las rutas
const routes = [
  ...publicRoutes,
  ...authRoutes,
  ...adminRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Aplicar guards
router.beforeEach(authGuard)

export default router