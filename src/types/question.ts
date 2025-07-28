/**
 * Definiciones de tipos para preguntas de encuestas
 * @description Tipos, interfaces y configuraciones para el manejo de preguntas
 * @module Question Types
 */

/**
 * Tipos de pregunta soportados por el sistema
 * @type QuestionType
 */
export type QuestionType = 
  | 'SINGLE_CHOICE' 
  | 'MULTIPLE_CHOICE' 
  | 'YES_NO' 
  | 'SCALE' 
  | 'TEXT'
  | 'NUMBER'

/**
 * Configuración específica para preguntas tipo escala
 * @interface ScaleOptions
 */
export interface ScaleOptions {
  min: number
  max: number
  step?: number
  labels?: Record<string, string>
}

/**
 * Configuración específica para preguntas numéricas
 * @interface NumberOptions
 */
export interface NumberOptions {
  min: number
  max: number
}

/**
 * Opciones de pregunta según el tipo
 * @type QuestionOptions
 */
export type QuestionOptions = string[] | ScaleOptions | null

/**
 * Estructura completa de una pregunta
 * @interface Question
 */
export interface Question {
  id: string
  text: string
  type: QuestionType
  required: boolean
  options: QuestionOptions
  order: number
}

/**
 * Datos para crear una nueva pregunta
 * @interface CreateQuestionRequest
 */
export interface CreateQuestionRequest {
  text: string
  type: QuestionType
  required: boolean
  options: QuestionOptions
  order: number
}
