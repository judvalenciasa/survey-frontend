import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/dashboard/AdminLayout.vue'

const adminRoutes: RouteRecordRaw[] = [
  // Redirect principal
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'surveys',
        name: 'SurveyList',
        component: () => import('@/views/admin/SurveyListView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'surveys/create',
        name: 'SurveyCreate',
        component: () => import('@/views/admin/SurveyCreateView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'surveys/:id/edit',
        name: 'SurveyEdit',
        component: () => import('@/views/admin/SurveyEditView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'responses',
        name: 'ResponseView',
        component: () => import('@/views/admin/ResponseView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'analytics',
        name: 'AnalyticsView',
        component: () => import('@/views/admin/AnalyticsView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'users',
        name: 'UserView',
        component: () => import('@/views/admin/UserView.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]

export default adminRoutes