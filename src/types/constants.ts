/**
 * Constantes y utilidades para tipos de preguntas y estados de encuestas
 * @description Proporciona arrays de configuración para uso en formularios y validaciones
 * @module Constants Types
 */

import type { QuestionType } from './question'
import type { SurveyStatus } from './survey'

/**
 * Configuración de tipos de pregunta disponibles
 * @constant QUESTION_TYPES
 */
export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'TEXT', label: 'Texto libre' },
  { value: 'SINGLE_CHOICE', label: 'Opción única' },
  { value: 'MULTIPLE_CHOICE', label: 'Múltiple selección' },
  { value: 'YES_NO', label: 'Sí/No' },
  { value: 'SCALE', label: 'Escala' }
]

/**
 * Configuración de estados de encuesta disponibles
 * @constant SURVEY_STATUSES
 */
export const SURVEY_STATUSES: { value: SurveyStatus; label: string }[] = [
  { value: 'CREADA', label: 'Creada' },
  { value: 'PUBLICADA', label: 'Publicada' },
  { value: 'PAUSADA', label: 'Pausada' },
  { value: 'FINALIZADA', label: 'Finalizada' }
]
