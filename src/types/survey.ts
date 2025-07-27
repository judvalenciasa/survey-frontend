// Tipos de pregunta soportados por el backend
export type QuestionType = 
  | 'SINGLE_CHOICE' 
  | 'MULTIPLE_CHOICE' 
  | 'YES_NO' 
  | 'SCALE' 
  | 'TEXT'
  | 'NUMBER'

// Configuración específica para preguntas tipo SCALE
export interface ScaleOptions {
  min: number
  max: number
  step?: number
  labels?: Record<string, string>
}

// Configuración específica para preguntas tipo NUMBER
export interface NumberOptions {
  min: number
  max: number
}

// Opciones de pregunta (pueden ser array de strings o configuración de escala)
export type QuestionOptions = string[] | ScaleOptions | null

// Estructura de pregunta según el backend
export interface Question {
  id: string
  text: string
  type: QuestionType
  required: boolean
  options: QuestionOptions
  order: number
}

// Pregunta para crear (sin ID)
export interface CreateQuestionRequest {
  text: string
  type: QuestionType
  required: boolean
  options: QuestionOptions
  order: number
}

// Tipos de estado - ACTUALIZAR para coincidir con el backend
export type SurveyStatus = 
  | 'CREADA'     // Estado inicial
  | 'PUBLICADA'  // ✨ CAMBIO: Era 'ACTIVA', ahora 'PUBLICADA' para coincidir con backend
  | 'PAUSADA'    // Temporalmente pausada
  | 'FINALIZADA' // Cerrada permanentemente

// Estructura de encuesta según el backend
export interface Survey {
  id: string
  name: string
  description: string
  version: number
  status: SurveyStatus
  createdAt: string
  modifiedAt: string
  scheduledOpen?: string
  scheduledClose?: string
  adminId: string
  branding?: any
  previousVersionId?: string
  questions: Question[]
  template: boolean
  
  // Campos adicionales que puede devolver el frontend
  totalResponses?: number
  code?: string
}

// Request para crear encuesta
export interface CreateSurveyRequest {
  name: string
  description: string
  scheduledOpen?: string
  scheduledClose?: string
  questions: CreateQuestionRequest[]
  template?: boolean
}

// Request para actualizar encuesta
export interface UpdateSurveyRequest {
  name?: string
  description?: string
  status?: SurveyStatus
  scheduledOpen?: string
  scheduledClose?: string
  questions?: Question[]
  template?: boolean
}

// Respuesta de encuesta
export interface SurveyResponse {
  id: string
  surveyId: string
  answers: Record<string, any>
  submittedAt: string
  ipAddress?: string
}

// Utilidades para validación
export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'TEXT', label: 'Texto libre' },
  { value: 'SINGLE_CHOICE', label: 'Opción única' },
  { value: 'MULTIPLE_CHOICE', label: 'Múltiple selección' },
  { value: 'YES_NO', label: 'Sí/No' },
  { value: 'SCALE', label: 'Escala' }
]

export const SURVEY_STATUSES: { value: SurveyStatus; label: string }[] = [
  { value: 'CREADA', label: 'Creada' },
  { value: 'PUBLICADA', label: 'Publicada' },
  { value: 'PAUSADA', label: 'Pausada' },
  { value: 'FINALIZADA', label: 'Finalizada' }
]
