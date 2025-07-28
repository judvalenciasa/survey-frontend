import type { AxiosResponse } from 'axios'
import api from './api'
import type { 
  Survey, 
  CreateSurveyRequest, 
  UpdateSurveyRequest,
} from '@/types/survey'
import type { SurveyResponse } from '@/types/response'

class SurveyService {
  private readonly baseURL = '/api/surveys'

  // Obtener todas las encuestas del usuario
  async getSurveys(): Promise<AxiosResponse<Survey[]>> {
    return api.get<Survey[]>(this.baseURL)
  }

  // Obtener una encuesta por ID (para administrador)
  async getSurvey(id: string): Promise<AxiosResponse<Survey>> {
    return api.get<Survey>(`${this.baseURL}/${id}`)
  }

  // ✨ NUEVO: Obtener encuesta para respuesta pública por ID
  async getSurveyForResponse(id: string): Promise<AxiosResponse<Survey>> {
    return api.get<Survey>(`${this.baseURL}/${id}/view`)
  }

  // Obtener encuesta por código público (si aplica)
  async getSurveyByCode(code: string): Promise<AxiosResponse<Survey>> {
    return api.get<Survey>(`${this.baseURL}/public/${code}`)
  }

  // Crear nueva encuesta
  async createSurvey(data: CreateSurveyRequest): Promise<AxiosResponse<Survey>> {
    return api.post<Survey>(this.baseURL, data)
  }

  // Actualizar encuesta
  async updateSurvey(id: string, data: UpdateSurveyRequest): Promise<AxiosResponse<Survey>> {
    return api.put<Survey>(`${this.baseURL}/${id}`, data)
  }

  // ✨ NUEVO: Publicar encuesta
  async publishSurvey(id: string): Promise<AxiosResponse<Survey>> {
    return api.post<Survey>(`${this.baseURL}/${id}/publish`)
  }

  // ✨ NUEVO: Cerrar encuesta
  async closeSurvey(id: string): Promise<AxiosResponse<Survey>> {
    return api.post<Survey>(`${this.baseURL}/${id}/close`)
  }

  // Eliminar encuesta
  async deleteSurvey(id: string): Promise<AxiosResponse<void>> {
    return api.delete<void>(`${this.baseURL}/${id}`)
  }

  // Cambiar estado de encuesta (método genérico - puede mantenerse para compatibilidad)
  async updateSurveyStatus(id: string, status: string): Promise<AxiosResponse<Survey>> {
    return api.patch<Survey>(`${this.baseURL}/${id}/status`, { status })
  }

  // Obtener respuestas de una encuesta
  async getSurveyResponses(id: string): Promise<AxiosResponse<SurveyResponse[]>> {
    return api.get<SurveyResponse[]>(`${this.baseURL}/${id}/responses`)
  }

  // ✨ ACTUALIZADO: Enviar respuesta usando ID en lugar de código
  async submitResponse(surveyId: string, answers: Record<string, any>): Promise<AxiosResponse<any>> {
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer
    }))

    const payload = {
      surveyId,
      answers: formattedAnswers
    }

    return api.post<any>('/api/responses/submit', payload)
  }

  // Duplicar encuesta
  async duplicateSurvey(id: string): Promise<AxiosResponse<Survey>> {
    return api.post<Survey>(`${this.baseURL}/${id}/duplicate`)
  }
}

export const surveyService = new SurveyService()
