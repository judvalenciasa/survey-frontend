/**
 * Constantes y utilidades para encuestas
 */

import type { QuestionType } from './question'
import type { SurveyStatus } from './survey'

// Utilidades para validación de tipos de pregunta
export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'TEXT', label: 'Texto libre' },
  { value: 'SINGLE_CHOICE', label: 'Opción única' },
  { value: 'MULTIPLE_CHOICE', label: 'Múltiple selección' },
  { value: 'YES_NO', label: 'Sí/No' },
  { value: 'SCALE', label: 'Escala' }
]

// Utilidades para estados de encuesta
export const SURVEY_STATUSES: { value: SurveyStatus; label: string }[] = [
  { value: 'CREADA', label: 'Creada' },
  { value: 'PUBLICADA', label: 'Publicada' },
  { value: 'PAUSADA', label: 'Pausada' },
  { value: 'FINALIZADA', label: 'Finalizada' }
]
