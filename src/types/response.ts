/**
 * Definiciones de tipos para respuestas de encuestas
 * @description Interfaces para manejo de respuestas y estadísticas
 * @module Response Types
 */

/**
 * Estructura de una respuesta individual a una pregunta
 */
export interface QuestionAnswer {
  questionId: string
  answer: any
}

/**
 * Respuesta completa de una encuesta
 * @interface SurveyResponse
 */
export interface SurveyResponse {
  id: string
  surveyId: string
  answers: QuestionAnswer[]  // Cambio aquí: array en lugar de Record
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



