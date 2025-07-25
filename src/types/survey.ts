export interface Question {
  id: string
  type: 'text' | 'multiple-choice' | 'rating' | 'boolean'
  title: string
  description?: string
  required: boolean
  options?: string[] // Para multiple-choice
  maxRating?: number // Para rating (1-5, 1-10, etc.)
}

export interface Survey {
  id: string
  title: string
  description: string
  code: string // Código público para acceder
  questions: Question[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  totalResponses: number
}

export interface SurveyResponse {
  id: string
  surveyId: string
  answers: Record<string, any> // questionId -> answer
  submittedAt: string
  ipAddress?: string
}

export interface CreateSurveyRequest {
  title: string
  description: string
  questions: Omit<Question, 'id'>[]
}

export interface UpdateSurveyRequest {
  title?: string
  description?: string
  questions?: Question[]
  isActive?: boolean
}
