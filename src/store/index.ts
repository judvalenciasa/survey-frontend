/**
 * Configuración principal del store Pinia
 * @description Instancia centralizada de Pinia y exportaciones de stores
 * @module Store Configuration
 */

import { createPinia } from 'pinia'
import { useAuthStore } from './modules/auth'
import { useSurveyStore } from './modules/survey'

/**
 * Instancia principal de Pinia configurada para la aplicación
 * @constant pinia
 */
export const pinia = createPinia()

/**
 * Exportaciones de conveniencia para acceso a stores específicos
 */
export {
  useAuthStore,
  useSurveyStore
}

/**
 * Composable que proporciona acceso unificado a todos los stores
 * @returns Objeto con todos los stores disponibles
 */
export const useStores = () => ({
  auth: useAuthStore(),
  survey: useSurveyStore()
})

/**
 * Tipo TypeScript que define la estructura de todos los stores
 * @type AppStores
 */
export type AppStores = ReturnType<typeof useStores>

/**
 * Re-exportación de createPinia para casos de uso específicos
 */
export { createPinia } from 'pinia'
