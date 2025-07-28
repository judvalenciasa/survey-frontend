/**
 * Tipos principales de encuestas
 */

import type { Question, CreateQuestionRequest } from './question'

// Tipos de estado de encuesta
export type SurveyStatus = 
  | 'CREADA'     // Estado inicial
  | 'PUBLICADA'  // Publicada para responder
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


