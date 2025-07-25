import type { RouteRecordRaw } from 'vue-router'

const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/public/HomeView.vue')
  },
  {
    path: '/survey-presentation',
    name: 'SurveyPresentation',
    component: () => import('@/views/public/SurveyPublicView.vue')
  },
  // Wildcard route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

export default publicRoutes