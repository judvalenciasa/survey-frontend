/**
 * Definiciones de tipos para respuestas de encuestas
 * @description Interfaces para manejo de respuestas y estadísticas
 * @module Response Types
 */

/**
 * Respuesta completa de una encuesta
 * @interface SurveyResponse
 */
export interface SurveyResponse {
  id: string
  surveyId: string
  answers: Record<string, any>
  submittedAt: string
  ipAddress?: string
}

/**
 * Datos para crear una nueva respuesta
 * @interface CreateResponseRequest
 */
export interface CreateResponseRequest {
  surveyId: string
  answers: Record<string, any>
}

/**
 * Estadísticas agregadas de respuestas
 * @interface ResponseStats
 */
export interface ResponseStats {
  totalResponses: number
  averageCompletionTime?: number
  completionRate: number
}
