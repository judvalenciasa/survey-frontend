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
      },
      // ✨ ACTUALIZADO: Usar ID en lugar de code
      {
        path: 'survey/:id',
        name: 'SurveyResponse',
        component: () => import('@/views/public/SurveyResponseView.vue'),
        props: true
      },
      {
        path: 'thank-you',
        name: 'ThankYou',
        component: () => import('@/views/public/ThankYouView.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

export default publicRoutes