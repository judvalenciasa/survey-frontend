import type { RouteRecordRaw } from 'vue-router'
import FullLayout from '@/layouts/full/FullLayout.vue'

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: FullLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue'),
        alias: '/login', // Para mantener /login funcionando
        meta: {
          requiresGuest: true
        }
      }
    ]
  }
]

export default authRoutes