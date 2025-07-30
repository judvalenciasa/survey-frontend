/**
 * Rutas del panel de administración
 * @description Define todas las rutas para el área administrativa de la aplicación
 * @module Admin Routes
 */
import type { RouteRecordRaw } from 'vue-router'

/**
 * Configuración de rutas administrativas
 * @description Rutas protegidas que requieren autenticación y permisos de admin
 */
const adminRoutes: RouteRecordRaw[] = [

  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin',
    component: () => import('@/layouts/dashboard/AdminLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/admin/dashboard/DashboardView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'surveys',
        name: 'SurveyList',
        component: () => import('@/views/admin/survey/SurveyListView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'surveys/create',
        name: 'SurveyCreate',
        component: () => import('@/views/admin/survey/SurveyCreateView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'surveys/:id/edit',
        name: 'SurveyEdit',
        component: () => import('@/views/admin/survey/SurveyEditView.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'responses',
        name: 'AdminResponses',
        component: () => import('@/views/admin/response/ResponseView.vue'),
        meta: {
          requiresAuth: true,
          title: 'Gestión de Respuestas'
        }
      },
      {
        path: 'analytics',
        name: 'AnalyticsView',
        component: () => import('@/views/admin/analitycs/AnalyticsView.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  }
]

export default adminRoutes