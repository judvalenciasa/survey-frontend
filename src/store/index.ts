/**
 * Configuración principal del store usando Pinia
 */

import { createPinia } from 'pinia'
import { useAuthStore } from './modules/auth'
import { useSurveyStore } from './modules/survey'

/**
 * Instancia principal de Pinia
 */
export const pinia = createPinia()

/**
 * Exportaciones de conveniencia para los stores
 */
export {
  useAuthStore,
  useSurveyStore
}

/**
 * Composable para acceso rápido a todos los stores
 */
export const useStores = () => ({
  auth: useAuthStore(),
  survey: useSurveyStore()
})

/**
 * Tipos TypeScript para los stores (opcional)
 */
export type AppStores = ReturnType<typeof useStores>

/**
 * Re-exportar createPinia para casos especiales
 */
export { createPinia } from 'pinia'
