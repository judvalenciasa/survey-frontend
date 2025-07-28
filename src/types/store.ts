/**
 * Tipos para estados de stores relacionados con encuestas
 */

import type { Survey } from './survey'
import type { SurveyResponse } from './response'

// Estado del store de encuestas
export interface SurveyState {
  surveys: Survey[]
  currentSurvey: Survey | null
  loading: boolean
  error: string | null
}

// Estado del store de respuestas (para futuro)
export interface ResponseState {
  responses: SurveyResponse[]
  currentResponse: SurveyResponse | null
  loading: boolean
  error: string | null
}
