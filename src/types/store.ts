/**
 * Definiciones de tipos para estados de stores Pinia
 * @description Interfaces para estados globales de la aplicación
 * @module Store Types
 */

import type { Survey } from './survey'
import type { SurveyResponse } from './response'

/**
 * Estado del store de encuestas
 * @interface SurveyState
 */
export interface SurveyState {
  surveys: Survey[]
  currentSurvey: Survey | null
  loading: boolean
  error: string | null
}

/**
 * Estado del store de respuestas
 * @interface ResponseState
 */
export interface ResponseState {
  responses: SurveyResponse[]
  currentResponse: SurveyResponse | null
  loading: boolean
  error: string | null
}
