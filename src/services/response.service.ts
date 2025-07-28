/**
 * Servicio de gestión de respuestas
 * @description Maneja operaciones específicas de respuestas y análisis
 * @module Response Service
 */
import type { AxiosResponse } from 'axios'
import api from './api'
import type { SurveyResponse, CreateResponseRequest, ResponseStats } from '@/types/response'
import { publicApi } from './api'  // ✅ Importar cliente público

/**
 * Clase que encapsula todas las operaciones relacionadas con respuestas
 */
class ResponseService {
  private baseURL = '/responses'

  /**
   * Obtiene todas las respuestas de una encuesta específica
   * @param surveyId - ID de la encuesta
   * @returns Lista de respuestas de la encuesta
   */
  async getResponsesBySurvey(surveyId: string): Promise<AxiosResponse<SurveyResponse[]>> {
    return api.get<SurveyResponse[]>(`${this.baseURL}/survey/${surveyId}`)
  }

  /**
   * Obtiene una respuesta específica por ID
   * @param id - ID de la respuesta
   * @returns Datos completos de la respuesta
   */
  async getResponse(id: string): Promise<AxiosResponse<SurveyResponse>> {
    return api.get<SurveyResponse>(`${this.baseURL}/${id}`)
  }

  /**
   * Crea una nueva respuesta para una encuesta
   * @param responseData - Datos de la respuesta
   * @returns Respuesta creada
   */
  async createResponse(responseData: CreateResponseRequest): Promise<AxiosResponse<SurveyResponse>> {
    return api.post<SurveyResponse>(this.baseURL, responseData)
  }

  /**
   * Elimina una respuesta específica
   * @param id - ID de la respuesta a eliminar
   * @returns Confirmación de eliminación
   */
  async deleteResponse(id: string): Promise<AxiosResponse<void>> {
    return api.delete(`${this.baseURL}/${id}`)
  }

  /**
   * Obtiene estadísticas de respuestas para una encuesta
   * @param surveyId - ID de la encuesta
   * @returns Estadísticas agregadas de respuestas
   */
  async getResponseStats(surveyId: string): Promise<AxiosResponse<ResponseStats>> {
    return api.get<ResponseStats>(`${this.baseURL}/survey/${surveyId}/stats`)
  }

  /**
   * Exporta respuestas en formato CSV
   * @param surveyId - ID de la encuesta
   * @returns Datos en formato CSV
   */
  async exportResponses(surveyId: string): Promise<AxiosResponse<Blob>> {
    return api.get(`${this.baseURL}/survey/${surveyId}/export`, {
      responseType: 'blob',
      headers: {
        'Accept': 'text/csv'
      }
    })
  }

  /**
   * Obtiene análisis agregado de respuestas
   * @param surveyId - ID de la encuesta
   * @returns Análisis de respuestas por pregunta
   */
  async getResponseAnalysis(surveyId: string): Promise<AxiosResponse<any>> {
    return api.get(`${this.baseURL}/survey/${surveyId}/analysis`)
  }

  /**
   * Envía una respuesta de encuesta
   * @param surveyId - ID de la encuesta
   * @param responses - Respuestas del usuario
   * @returns Confirmación del envío
   */
  async submitSurveyResponse(surveyId: string, responses: Record<string, any>): Promise<AxiosResponse<any>> {
    const responseData = {
      surveyId,
      answers: Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer
      }))
    }
   console.log('🚀 Enviando respuesta pública (SIN TOKEN):', responseData)
    
    
    return publicApi.post<any>('/api/responses/submit', responseData)
  }
}

/**
 * Instancia singleton del servicio de respuestas
 */
export const responseService = new ResponseService()
