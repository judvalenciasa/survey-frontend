/**
 * Rutas públicas de la aplicación
 * @description Define todas las rutas accesibles sin autenticación
 * @module Public Routes
 */
import type { RouteRecordRaw } from 'vue-router'

/**
 * Configuración de rutas públicas
 * @description Rutas accesibles para todos los usuarios, incluyendo respuesta a encuestas
 */
const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/full/FullLayout.vue'),
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