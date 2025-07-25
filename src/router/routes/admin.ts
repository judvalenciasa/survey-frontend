import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  // Redirect principal
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/admin/DashboardView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/surveys',
    name: 'SurveyList',
    component: () => import('@/views/admin/SurveyListView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/surveys/create',
    name: 'SurveyCreate',
    component: () => import('@/views/admin/SurveyCreateView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/surveys/:id/edit',
    name: 'SurveyEdit',
    component: () => import('@/views/admin/SurveyEditView.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/responses',
    name: 'ResponseView',
    component: () => import('@/views/admin/ResponseView.vue'),
    meta: {
      requiresAuth: true
    }
  }
]

export default adminRoutes