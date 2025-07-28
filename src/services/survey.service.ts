/**
 * Servicio de gestión de encuestas
 * @description Maneja todas las operaciones CRUD de encuestas y respuestas
 * @module Survey Service
 */
import type { AxiosResponse } from 'axios'
import api from './api'
import type { 
  Survey, 
  CreateSurveyRequest, 
  UpdateSurveyRequest,
} from '@/types/survey'
import type { SurveyResponse } from '@/types/response'

/**
 * Clase que encapsula todas las operaciones relacionadas con encuestas
 */
class SurveyService {
  private readonly baseURL = '/api/surveys'

  /**
   * Obtiene todas las encuestas del usuario autenticado
   * @returns Lista de encuestas del usuario
   */
  async getSurveys(): Promise<AxiosResponse<Survey[]>> {
    return api.get<Survey[]>(this.baseURL)
  }

  /**
   * Obtiene una encuesta específica por ID (para administrador)
   * @param id - ID de la encuesta
   * @returns Datos completos de la encuesta
   */
  async getSurvey(id: string): Promise<AxiosResponse<Survey>> {
    return api.get<Survey>(`${this.baseURL}/${id}`)
  }

  /**
   * Obtiene encuesta para respuesta pública por ID
   * @param id - ID de la encuesta
   * @returns Encuesta preparada para respuestas públicas
   */
  async getSurveyForResponse(id: string): Promise<AxiosResponse<Survey>> {
    return api.get<Survey>(`${this.baseURL}/${id}/view`)
  }

  /**
   * Obtiene encuesta por código público
   * @param code - Código público de la encuesta
   * @returns Encuesta accesible públicamente
   */
  async getSurveyByCode(code: string): Promise<AxiosResponse<Survey>> {
    return api.get<Survey>(`${this.baseURL}/public/${code}`)
  }

  /**
   * Crea una nueva encuesta
   * @param data - Datos de la encuesta a crear
   * @returns Encuesta creada con ID asignado
   */
  async createSurvey(data: CreateSurveyRequest): Promise<AxiosResponse<Survey>> {
    return api.post<Survey>(this.baseURL, data)
  }

  /**
   * Actualiza una encuesta existente
   * @param id - ID de la encuesta a actualizar
   * @param data - Datos parciales a actualizar
   * @returns Encuesta actualizada
   */
  async updateSurvey(id: string, data: UpdateSurveyRequest): Promise<AxiosResponse<Survey>> {
    return api.put<Survey>(`${this.baseURL}/${id}`, data)
  }

  /**
   * Publica una encuesta para hacerla disponible públicamente
   * @param id - ID de la encuesta a publicar
   * @returns Encuesta con estado actualizado
   */
  async publishSurvey(id: string): Promise<AxiosResponse<Survey>> {
    return api.post<Survey>(`${this.baseURL}/${id}/publish`)
  }

  /**
   * Cierra una encuesta para detener la recepción de respuestas
   * @param id - ID de la encuesta a cerrar
   * @returns Encuesta con estado actualizado
   */
  async closeSurvey(id: string): Promise<AxiosResponse<Survey>> {
    return api.post<Survey>(`${this.baseURL}/${id}/close`)
  }

  /**
   * Elimina una encuesta permanentemente
   * @param id - ID de la encuesta a eliminar
   * @returns Confirmación de eliminación
   */
  async deleteSurvey(id: string): Promise<AxiosResponse<void>> {
    return api.delete<void>(`${this.baseURL}/${id}`)
  }

  /**
   * Cambia el estado de una encuesta (método genérico)
   * @param id - ID de la encuesta
   * @param status - Nuevo estado de la encuesta
   * @returns Encuesta con estado actualizado
   */
  async updateSurveyStatus(id: string, status: string): Promise<AxiosResponse<Survey>> {
    return api.patch<Survey>(`${this.baseURL}/${id}/status`, { status })
  }

  /**
   * Obtiene todas las respuestas de una encuesta específica
   * @param id - ID de la encuesta
   * @returns Lista de respuestas de la encuesta
   */
  async getSurveyResponses(id: string): Promise<AxiosResponse<SurveyResponse[]>> {
    return api.get<SurveyResponse[]>(`${this.baseURL}/${id}/responses`)
  }

  /**
   * Envía una respuesta a una encuesta usando su ID
   * @param surveyId - ID de la encuesta
   * @param answers - Respuestas organizadas por ID de pregunta
   * @returns Confirmación del envío
   */
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

  /**
   * Duplica una encuesta existente
   * @param id - ID de la encuesta a duplicar
   * @returns Nueva encuesta duplicada
   */
  async duplicateSurvey(id: string): Promise<AxiosResponse<Survey>> {
    return api.post<Survey>(`${this.baseURL}/${id}/duplicate`)
  }
}

/**
 * Instancia singleton del servicio de encuestas
 */
export const surveyService = new SurveyService()
