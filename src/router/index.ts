import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/public/HomeView.vue')  // Público
      },
      {
        path: '/survey-presentation', 
        name: 'SurveyPresentation',
        component: () => import('@/views/public/SurveyPublicView.vue')  // Público
      },
      {
        path: '/login',
        component: () => import('@/views/auth/LoginView.vue')  // Auth
      },
      {
        path: '/dashboard',
        component: () => import('@/views/admin/DashboardView.vue')  // Admin
      }
  ]
})

// Guard global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Ruta requiere autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }
  
  // Ruta solo para invitados
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/dashboard')
  }
  
  // Ruta requiere rol específico
  if (to.meta.requiresRole && !authStore.isAdmin) {
    return next('/dashboard')
  }
  
  next()
})

export default router