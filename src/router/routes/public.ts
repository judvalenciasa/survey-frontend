import type { RouteRecordRaw } from 'vue-router'
import FullLayout from '@/layouts/full/FullLayout.vue'

const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: FullLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/public/HomeView.vue')
      },
      {
        path: 'survey-presentation',
        name: 'SurveyPresentation',
        component: () => import('@/views/public/SurveyPublicView.vue')
      }
    ]
  },
  // Wildcard route - sin layout
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

export default publicRoutes