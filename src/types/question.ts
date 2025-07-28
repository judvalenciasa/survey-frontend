/**
 * Tipos relacionados con preguntas de encuestas
 */

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
