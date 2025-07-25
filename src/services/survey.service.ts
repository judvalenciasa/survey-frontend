import type { AxiosResponse } from 'axios'
import api from './api'
import type { 
  Survey, 
  CreateSurveyRequest, 
  UpdateSurveyRequest,
  SurveyResponse 
} from '@/types/survey'

class SurveyService {
  // Obtener todas las encuestas del usuario
  async getSurveys(): Promise<AxiosResponse<Survey[]>> {
    return api.get<Survey[]>('/api/surveys')
  }

  // Obtener una encuesta por ID
  async getSurvey(id: string): Promise<AxiosResponse<Survey>> {
    return api.get<Survey>(`/api/surveys/${id}`)
  }

  // Obtener encuesta por código público
  async getSurveyByCode(code: string): Promise<AxiosResponse<Survey>> {
    return api.get<Survey>(`/api/surveys/public/${code}`)
  }

  // Crear nueva encuesta
  async createSurvey(data: CreateSurveyRequest): Promise<AxiosResponse<Survey>> {
    return api.post<Survey>('/api/surveys', data)
  }

  // Actualizar encuesta
  async updateSurvey(id: string, data: UpdateSurveyRequest): Promise<AxiosResponse<Survey>> {
    return api.put<Survey>(`/api/surveys/${id}`, data)
  }

  // Eliminar encuesta
  async deleteSurvey(id: string): Promise<AxiosResponse<void>> {
    return api.delete<void>(`/api/surveys/${id}`)
  }

  // Generar nuevo código para encuesta
  async generateNewCode(id: string): Promise<AxiosResponse<{ code: string }>> {
    return api.post<{ code: string }>(`/api/surveys/${id}/generate-code`)
  }

  // Obtener respuestas de una encuesta
  async getSurveyResponses(id: string): Promise<AxiosResponse<SurveyResponse[]>> {
    return api.get<SurveyResponse[]>(`/api/surveys/${id}/responses`)
  }

  // Enviar respuesta de encuesta (público)
  async submitResponse(code: string, answers: Record<string, any>): Promise<AxiosResponse<void>> {
    return api.post<void>(`/api/surveys/public/${code}/submit`, { answers })
  }
}

export const surveyService = new SurveyService()
