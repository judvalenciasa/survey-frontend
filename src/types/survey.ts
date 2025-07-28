/**
 * Definiciones de tipos principales para encuestas
 * @description Tipos centrales para manejo de encuestas y sus estados
 * @module Survey Types
 */

import type { Question, CreateQuestionRequest } from './question'

/**
 * Estados posibles de una encuesta
 * @type SurveyStatus
 */
export type SurveyStatus = 
  | 'CREADA'
  | 'PUBLICADA'
  | 'FINALIZADA'

/**
 * Estructura completa de una encuesta
 * @interface Survey
 */
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
  totalResponses?: number
  code?: string
}

/**
 * Datos para crear una nueva encuesta
 * @interface CreateSurveyRequest
 */
export interface CreateSurveyRequest {
  name: string
  description: string
  scheduledOpen?: string
  scheduledClose?: string
  questions: CreateQuestionRequest[]
  template?: boolean
}

/**
 * Datos para actualizar una encuesta existente
 * @interface UpdateSurveyRequest
 */
export interface UpdateSurveyRequest {
  name?: string
  description?: string
  status?: SurveyStatus
  scheduledOpen?: string
  scheduledClose?: string
  questions?: Question[]
  template?: boolean
}


