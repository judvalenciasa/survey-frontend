import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Survey, CreateSurveyRequest, SurveyStatus } from '@/types/survey'
import { surveyService } from '@/services/survey.service'

export const useSurveyStore = defineStore('survey', () => {
  // Estado
  const surveys = ref<Survey[]>([])
  const currentSurvey = ref<Survey | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters computados
  const activeSurveys = computed(() => 
    surveys.value.filter(survey => survey.status === 'PUBLICADA')
  )
  
  const totalSurveys = computed(() => surveys.value.length)
  
  const totalResponses = computed(() => 
    surveys.value.reduce((sum, survey) => sum + (survey.totalResponses || 0), 0)
  )

  const getSurveysByStatus = computed(() => (status: SurveyStatus) =>
    surveys.value.filter(survey => survey.status === status)
  )

  // Acciones
  const fetchSurveys = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await surveyService.getSurveys()
      surveys.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar encuestas'
      console.error('Error fetching surveys:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchSurvey = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await surveyService.getSurvey(id)
      currentSurvey.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar encuesta'
      console.error('Error fetching survey:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createSurvey = async (data: CreateSurveyRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await surveyService.createSurvey(data)
      surveys.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al crear encuesta'
      console.error('Error creating survey:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSurvey = async (id: string, data: Partial<Survey>) => {
    loading.value = true
    error.value = null

    try {
      const response = await surveyService.updateSurvey(id, data)
      const index = surveys.value.findIndex(s => s.id === id)
      if (index !== -1) {
        surveys.value[index] = response.data
      }
      if (currentSurvey.value?.id === id) {
        currentSurvey.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar encuesta'
      console.error('Error updating survey:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSurvey = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await surveyService.deleteSurvey(id)
      surveys.value = surveys.value.filter(s => s.id !== id)
      if (currentSurvey.value?.id === id) {
        currentSurvey.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar encuesta'
      console.error('Error deleting survey:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSurveyStatus = async (id: string, status: SurveyStatus) => {
    loading.value = true
    error.value = null

    try {
      const response = await surveyService.updateSurveyStatus(id, status)
      const index = surveys.value.findIndex(s => s.id === id)
      if (index !== -1) {
        surveys.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar estado'
      console.error('Error updating survey status:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✨ NUEVO: Publicar encuesta
  const publishSurvey = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await surveyService.publishSurvey(id)
      const index = surveys.value.findIndex(s => s.id === id)
      if (index !== -1) {
        surveys.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al publicar encuesta'
      console.error('Error publishing survey:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // ✨ NUEVO: Cerrar encuesta
  const closeSurvey = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await surveyService.closeSurvey(id)
      const index = surveys.value.findIndex(s => s.id === id)
      if (index !== -1) {
        surveys.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cerrar encuesta'
      console.error('Error closing survey:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentSurvey = () => {
    currentSurvey.value = null
  }

  return {
    // Estado
    surveys,
    currentSurvey,
    loading,
    error,
    
    // Getters
    activeSurveys,
    totalSurveys,
    totalResponses,
    getSurveysByStatus,
    
    // Acciones
    fetchSurveys,
    fetchSurvey,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    updateSurveyStatus,
    publishSurvey,    // ✨ NUEVO
    closeSurvey,      // ✨ NUEVO
    clearError,
    clearCurrentSurvey
  }
}) 