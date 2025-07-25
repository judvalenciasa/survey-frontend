import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Survey, CreateSurveyRequest } from '@/types/survey'
import { surveyService } from '@/services/survey.service'

export const useSurveyStore = defineStore('survey', () => {
  // Estado
  const surveys = ref<Survey[]>([])
  const currentSurvey = ref<Survey | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters computados
  const activeSurveys = computed(() => 
    surveys.value.filter(survey => survey.isActive)
  )
  
  const totalSurveys = computed(() => surveys.value.length)
  
  const totalResponses = computed(() => 
    surveys.value.reduce((sum, survey) => sum + survey.totalResponses, 0)
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
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar encuesta'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    surveys,
    currentSurvey,
    loading,
    error,
    activeSurveys,
    totalSurveys,
    totalResponses,
    fetchSurveys,
    createSurvey,
    deleteSurvey
  }
}) 