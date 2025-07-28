/**
 * Store de gestión de encuestas
 * @description Maneja el estado global de encuestas, operaciones CRUD y filtros
 * @module Survey Store
 */
import { defineStore } from 'pinia'
import type { Survey, CreateSurveyRequest, SurveyStatus } from '@/types/survey'
import type { SurveyState } from '@/types/store'
import { surveyService } from '@/services/survey.service'

/**
 * Store principal de encuestas usando Pinia
 * @description Gestiona todas las operaciones relacionadas con encuestas
 */
export const useSurveyStore = defineStore('survey', {
  state: (): SurveyState => ({
    surveys: [],
    currentSurvey: null,
    loading: false,
    error: null
  }),

  getters: {
    /**
     * Obtiene únicamente las encuestas publicadas
     * @returns Array de encuestas con estado 'PUBLICADA'
     */
    activeSurveys: (state) => 
      state.surveys.filter(survey => survey.status === 'PUBLICADA'),
    
    /**
     * Cuenta total de encuestas disponibles
     * @returns Número total de encuestas
     */
    totalSurveys: (state) => state.surveys.length,
    
    /**
     * Suma total de respuestas de todas las encuestas
     * @returns Número total de respuestas acumuladas
     */
    totalResponses: (state) => 
      state.surveys.reduce((sum, survey) => sum + (survey.totalResponses || 0), 0),

    /**
     * Función para filtrar encuestas por estado específico
     * @param status - Estado de encuesta a filtrar
     * @returns Array de encuestas con el estado especificado
     */
    getSurveysByStatus: (state) => (status: SurveyStatus) =>
      state.surveys.filter(survey => survey.status === status)
  },

  actions: {
    /**
     * Carga todas las encuestas desde el servidor
     * @description Actualiza el estado con la lista completa de encuestas
     */
    async fetchSurveys() {
      this.loading = true
      this.error = null

      try {
        const response = await surveyService.getSurveys()
        this.surveys = response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al cargar encuestas'
        console.error('Error fetching surveys:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * Carga una encuesta específica por su ID
     */
    async fetchSurvey(id: string) {
      this.loading = true
      this.error = null

      try {
        const response = await surveyService.getSurvey(id)
        this.currentSurvey = response.data
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al cargar encuesta'
        console.error('Error fetching survey:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Crea una nueva encuesta en el servidor
     */
    async createSurvey(data: CreateSurveyRequest) {
      this.loading = true
      this.error = null

      try {
        const response = await surveyService.createSurvey(data)
        this.surveys.unshift(response.data)
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al crear encuesta'
        console.error('Error creating survey:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Actualiza una encuesta existente
     */
    async updateSurvey(id: string, data: Partial<Survey>) {
      this.loading = true
      this.error = null

      try {
        const response = await surveyService.updateSurvey(id, data)
        
        const index = this.surveys.findIndex(s => s.id === id)
        if (index !== -1) {
          this.surveys[index] = response.data
        }
        
        if (this.currentSurvey?.id === id) {
          this.currentSurvey = response.data
        }
        
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al actualizar encuesta'
        console.error('Error updating survey:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Elimina una encuesta permanentemente
     */
    async deleteSurvey(id: string) {
      this.loading = true
      this.error = null

      try {
        await surveyService.deleteSurvey(id)
        
        this.surveys = this.surveys.filter(s => s.id !== id)
        
        if (this.currentSurvey?.id === id) {
          this.currentSurvey = null
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al eliminar encuesta'
        console.error('Error deleting survey:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Cambia el estado de una encuesta
     */
    async updateSurveyStatus(id: string, status: SurveyStatus) {
      this.loading = true
      this.error = null

      try {
        const response = await surveyService.updateSurveyStatus(id, status)
        const index = this.surveys.findIndex(s => s.id === id)
        if (index !== -1) {
          this.surveys[index] = response.data
        }
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al actualizar estado'
        console.error('Error updating survey status:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Publica una encuesta (método de conveniencia)
     */
    async publishSurvey(id: string) {
      this.loading = true
      this.error = null

      try {
        const response = await surveyService.publishSurvey(id)
        const index = this.surveys.findIndex(s => s.id === id)
        if (index !== -1) {
          this.surveys[index] = response.data
        }
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al publicar encuesta'
        console.error('Error publishing survey:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Cierra una encuesta (método de conveniencia)
     */
    async closeSurvey(id: string) {
      this.loading = true
      this.error = null

      try {
        const response = await surveyService.closeSurvey(id)
        const index = this.surveys.findIndex(s => s.id === id)
        if (index !== -1) {
          this.surveys[index] = response.data
        }
        return response.data
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Error al cerrar encuesta'
        console.error('Error closing survey:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Limpia el mensaje de error actual
     */
    clearError() {
      this.error = null
    },

    /**
     * Limpia la encuesta actualmente seleccionada
     */
    clearCurrentSurvey() {
      this.currentSurvey = null
    }
  }
}) 