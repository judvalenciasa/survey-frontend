/**
 * Tipos relacionados con respuestas de encuestas
 */

// Respuesta de encuesta
export interface SurveyResponse {
  id: string
  surveyId: string
  answers: Record<string, any>
  submittedAt: string
  ipAddress?: string
}

// Request para crear respuesta
export interface CreateResponseRequest {
  surveyId: string
  answers: Record<string, any>
}

// Estadísticas de respuestas
export interface ResponseStats {
  totalResponses: number
  averageCompletionTime?: number
  completionRate: number
}
