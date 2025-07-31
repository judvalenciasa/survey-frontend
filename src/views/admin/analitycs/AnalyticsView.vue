<!--
/**
 * Vista de analíticas avanzadas
 * @description Página para análisis estadísticos y métricas detalladas con diseño adaptado a la encuesta
 * @view AnalyticsView
 */
-->
<template>
  <div class="analytics-view" :style="dynamicStyles">
    <!-- Header con selector de encuestas -->
    <header class="analytics-header card">
      <div class="flex flex-col gap-lg">
        <h1 class="page-title">
          Análisis de Encuestas
        </h1>

        <div class="survey-selector-container">
          <label for="survey-select" class="form-label">Seleccionar Encuesta:</label>
          <select id="survey-select" v-model="selectedSurveyId" class="form-input survey-select"
            :disabled="loadingSurveys" @change="loadSurveyAndAnalysis">
            <option value="">
              -- Selecciona una encuesta --
            </option>
            <option v-for="survey in surveys" :key="survey.id" :value="survey.id">
              {{ survey.name }} ({{ survey.status }})
            </option>
          </select>
        </div>
      </div>
    </header>

    <!-- Banner de información de la encuesta seleccionada -->
    <div v-if="selectedSurvey && !loadingAnalysis" class="survey-info-banner">
      <div class="survey-branding">
        <h2 class="selected-survey-title">{{ selectedSurvey.name }}</h2>
        <p class="selected-survey-description">{{ selectedSurvey.description }}</p>
        <div class="survey-meta">
          <span class="survey-status" :class="`status-${selectedSurvey.status.toLowerCase()}`">
            {{ selectedSurvey.status }}
          </span>
          <span class="survey-questions-count">
            {{ selectedSurvey.questions?.length || 0 }} preguntas
          </span>
          <span class="survey-responses-count">
            {{ selectedSurvey.totalResponses || 0 }} respuestas
          </span>
        </div>
      </div>
    </div>

    <!-- Estados de carga y error -->
    <div v-if="loadingSurveys" class="loading-state card">
      <div class="loading-spinner" />
      <p class="text-secondary">
        Cargando encuestas...
      </p>
    </div>

    <div v-else-if="errorMessage" class="error-state card">
      <div class="error-icon">
        ❌
      </div>
      <h3 class="text-primary">
        Error
      </h3>
      <p class="text-secondary">
        {{ errorMessage }}
      </p>
      <button class="btn btn-primary" @click="loadSurveys">
        Reintentar
      </button>
    </div>

    <!-- Área principal de análisis -->
    <main class="main-content">
      <!-- Sin encuesta seleccionada -->
      <div v-if="!selectedSurveyId" class="empty-state card">
        <div class="empty-icon">
          📊
        </div>
        <h3 class="text-primary">
          Selecciona una encuesta
        </h3>
        <p class="text-secondary">
          Elige una encuesta del menú desplegable para ver su análisis.
        </p>
      </div>

      <!-- Cargando análisis -->
      <div v-else-if="loadingAnalysis" class="loading-state card">
        <div class="loading-spinner" />
        <p class="text-secondary">
          Cargando análisis...
        </p>
      </div>

      <!-- Error al cargar análisis -->
      <div v-else-if="analysisError" class="error-state card">
        <div class="error-icon">
          ❌
        </div>
        <h3 class="text-primary">
          Error al cargar análisis
        </h3>
        <p class="text-secondary">
          {{ analysisError }}
        </p>
        <button class="btn btn-primary" @click="loadSurveyAndAnalysis">
          Reintentar
        </button>
      </div>

      <!-- Análisis cargado -->
      <div v-else-if="analysisData" class="analysis-loaded">
        <!-- Selector de preguntas con estilo de la encuesta -->
        <div class="questions-selector card survey-themed">
          <div class="selector-header">
            <h3 class="selector-title">
              <span class="selector-icon">📋</span>
              Seleccionar Preguntas para Analizar
            </h3>
            <div class="selector-actions">
              <button 
                class="btn btn-outline btn-sm survey-btn" 
                @click="selectAllQuestions"
                :disabled="allQuestionsSelected"
              >
                Seleccionar Todas
              </button>
              <button 
                class="btn btn-outline btn-sm survey-btn" 
                @click="clearAllQuestions"
                :disabled="selectedQuestions.length === 0"
              >
                Deseleccionar Todas
              </button>
            </div>
          </div>

          <div class="questions-list">
            <div 
              v-for="question in analysisData.questionsAnalysis" 
              :key="question.questionId"
              class="question-item survey-themed"
              :class="{ 'selected': selectedQuestions.includes(question.questionId) }"
            >
              <label class="question-checkbox">
                <input 
                  type="checkbox" 
                  :value="question.questionId"
                  v-model="selectedQuestions"
                  class="checkbox-input"
                >
                <span class="checkbox-custom survey-themed"></span>
                <div class="question-info">
                  <h4 class="question-text">{{ question.questionText }}</h4>
                  <div class="question-meta">
                    <span class="question-type-badge survey-themed">
                      {{ getQuestionTypeLabel(question.questionType) }}
                    </span>
                    <span class="answers-count">
                      {{ question.totalAnswers }} respuestas
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div v-if="selectedQuestions.length > 0" class="selection-summary survey-themed">
            <span class="summary-text">
              {{ selectedQuestions.length }} pregunta{{ selectedQuestions.length !== 1 ? 's' : '' }} seleccionada{{ selectedQuestions.length !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <!-- Gráficas de preguntas seleccionadas con estilo de la encuesta -->
        <div v-if="selectedQuestions.length > 0" class="analysis-container">
          <div class="analysis-header">
            <h3 class="analysis-title survey-themed">
              <span class="analysis-icon">📈</span>
              Análisis de "{{ selectedSurvey?.name }}"
            </h3>
          </div>
          
          <div 
            v-for="question in filteredQuestionsAnalysis" 
            :key="question.questionId"
            class="chart-card survey-themed"
          >
            <ChartRenderer :question-data="question" />
          </div>
        </div>

        <!-- Estado sin preguntas seleccionadas -->
        <div v-else class="no-questions-selected card survey-themed">
          <div class="empty-icon">
            📊
          </div>
          <h3 class="text-primary">
            Selecciona preguntas para ver sus gráficas
          </h3>
          <p class="text-secondary">
            Marca las casillas de las preguntas que deseas analizar en la sección superior.
          </p>
        </div>
      </div>

      <!-- Sin análisis disponible -->
      <div v-else-if="selectedSurveyId && !loadingAnalysis" class="empty-state card">
        <div class="empty-icon">
          📈
        </div>
        <h3 class="text-primary">
          Sin análisis disponible
        </h3>
        <p class="text-secondary">
          Esta encuesta no tiene análisis disponible aún.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSurveyStore } from '../../../store/modules/survey'
import { surveyService } from '../../../services/survey.service'
import ChartRenderer from '../../../components/common/ChartRenderer.vue'
import type { Survey } from '../../../types/survey'

// Store y estado reactivo
const surveyStore = useSurveyStore()
const selectedSurveyId = ref<string>('')
const selectedSurvey = ref<Survey | null>(null)
const analysisData = ref<any>(null)
const loadingSurveys = ref(false)
const loadingAnalysis = ref(false)
const errorMessage = ref<string | null>(null)
const analysisError = ref<string | null>(null)

// Nuevo estado para preguntas seleccionadas
const selectedQuestions = ref<string[]>([])

// Computed properties
const surveys = computed(() => surveyStore.surveys)

// Computed para verificar si todas las preguntas están seleccionadas
const allQuestionsSelected = computed(() => {
  if (!analysisData.value?.questionsAnalysis) return false
  return selectedQuestions.value.length === analysisData.value.questionsAnalysis.length
})

// Computed para obtener solo las preguntas seleccionadas
const filteredQuestionsAnalysis = computed(() => {
  if (!analysisData.value?.questionsAnalysis) return []
  return analysisData.value.questionsAnalysis.filter((question: any) => 
    selectedQuestions.value.includes(question.questionId)
  )
})

// Computed para estilos dinámicos basados en el branding de la encuesta
const dynamicStyles = computed(() => {
  if (!selectedSurvey.value?.branding) return {}
  
  const branding = selectedSurvey.value.branding
  const styles: Record<string, string> = {}
  
  // Aplicar colores personalizados si existen
  if (branding.primaryColor) {
    styles['--survey-primary-color'] = branding.primaryColor
  }
  if (branding.secondaryColor) {
    styles['--survey-secondary-color'] = branding.secondaryColor
  }
  if (branding.backgroundColor) {
    styles['--survey-background-color'] = branding.backgroundColor
  }
  if (branding.textColor) {
    styles['--survey-text-color'] = branding.textColor
  }
  if (branding.borderColor) {
    styles['--survey-border-color'] = branding.borderColor
  }
  
  return styles
})

// Watcher para resetear selección cuando cambia la encuesta
watch(selectedSurveyId, () => {
  selectedQuestions.value = []
  selectedSurvey.value = null
})

/**
 * Obtiene la etiqueta legible del tipo de pregunta
 */
const getQuestionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'TEXT': 'Texto',
    'SINGLE_CHOICE': 'Opción Única',
    'MULTIPLE_CHOICE': 'Opción Múltiple',
    'YES_NO': 'Sí/No',
    'SCALE': 'Escala',
    'NUMBER': 'Número'
  }
  return labels[type] || type
}

/**
 * Selecciona todas las preguntas
 */
const selectAllQuestions = () => {
  if (analysisData.value?.questionsAnalysis) {
    selectedQuestions.value = analysisData.value.questionsAnalysis.map((q: any) => q.questionId)
  }
}

/**
 * Deselecciona todas las preguntas
 */
const clearAllQuestions = () => {
  selectedQuestions.value = []
}

/**
 * Carga las encuestas disponibles
 */
const loadSurveys = async () => {
  loadingSurveys.value = true
  errorMessage.value = null

  try {
    await surveyStore.fetchSurveys()
    console.log(`✅ ${surveys.value.length} encuestas cargadas`)
  } catch (error: any) {
    console.error('❌ Error cargando encuestas:', error)
    errorMessage.value = error.response?.data?.message || 'Error al cargar las encuestas'
  } finally {
    loadingSurveys.value = false
  }
}

/**
 * Carga los datos completos de la encuesta y su análisis
 */
const loadSurveyAndAnalysis = async () => {
  if (!selectedSurveyId.value) {
    selectedSurvey.value = null
    analysisData.value = null
    selectedQuestions.value = []
    return
  }

  loadingAnalysis.value = true
  analysisError.value = null

  try {
    console.log(`📡 Cargando datos completos para encuesta: ${selectedSurveyId.value}`)
    
    // Cargar datos completos de la encuesta (incluyendo branding)
    const [surveyResponse, analysisResponse] = await Promise.all([
      surveyService.getSurvey(selectedSurveyId.value),
      surveyService.getSurveyAnalysis(selectedSurveyId.value)
    ])
    
    selectedSurvey.value = surveyResponse.data
    analysisData.value = analysisResponse.data
    
    console.log(`✅ Encuesta cargada:`, selectedSurvey.value)
    console.log(`✅ Análisis cargado:`, analysisData.value)
    
    // Si la encuesta tiene branding, aplicar estilos
    if (selectedSurvey.value.branding) {
      console.log('🎨 Aplicando branding personalizado:', selectedSurvey.value.branding)
    }
    
  } catch (error: any) {
    console.error('❌ Error cargando datos:', error)
    analysisError.value = error.response?.data?.message || 'Error al cargar los datos de la encuesta'
    selectedSurvey.value = null
    analysisData.value = null
  } finally {
    loadingAnalysis.value = false
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🚀 Iniciando AnalyticsView...')
  await loadSurveys()
})
</script>

<style scoped>
.analytics-view {
  padding: var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--bg-secondary);
  
  /* Variables CSS para el branding dinámico */
  --survey-primary-color: var(--primary-color);
  --survey-secondary-color: var(--secondary-color);
  --survey-background-color: var(--bg-primary);
  --survey-text-color: var(--text-primary);
  --survey-border-color: var(--border-color);
}

.analytics-header {
  margin-bottom: var(--spacing-xl);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.page-title::before {
  content: "📊";
  font-size: 1.5rem;
}

.survey-select {
  min-width: 350px;
  font-weight: 500;
}

/* Banner de información de la encuesta seleccionada */
.survey-info-banner {
  margin-bottom: var(--spacing-xl);
  background: var(--survey-background-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  border: 2px solid var(--survey-primary-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.survey-branding {
  text-align: center;
}

.selected-survey-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--survey-primary-color);
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1.2;
}

.selected-survey-description {
  font-size: 1.1rem;
  color: var(--survey-text-color);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: 1.5;
}

.survey-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.survey-status {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.status-creada {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid #d97706;
}

.status-publicada {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid #059669;
}

.status-finalizada {
  background: rgba(107, 114, 128, 0.1);
  color: #4b5563;
  border: 1px solid #4b5563;
}

.survey-questions-count,
.survey-responses-count {
  font-weight: 500;
  color: var(--survey-text-color);
}

.loading-state,
.error-state,
.empty-state,
.no-questions-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-2xl);
  margin: var(--spacing-xl) 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--survey-secondary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-lg);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

/* Estilos temáticos para elementos de la encuesta */
.survey-themed {
  border-color: var(--survey-primary-color) !important;
}

.questions-selector.survey-themed {
  background: var(--survey-background-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.survey-btn {
  color: var(--survey-primary-color) !important;
  border-color: var(--survey-primary-color) !important;
}

.survey-btn:hover {
  background: var(--survey-primary-color) !important;
  color: white !important;
}

.question-item.survey-themed.selected {
  border-color: var(--survey-secondary-color) !important;
  background: rgba(111, 207, 151, 0.05);
}

.checkbox-custom.survey-themed {
  border-color: var(--survey-border-color);
}

.checkbox-input:checked + .checkbox-custom.survey-themed {
  background: var(--survey-secondary-color) !important;
  border-color: var(--survey-secondary-color) !important;
}

.question-type-badge.survey-themed {
  background: var(--survey-primary-color) !important;
}

.selection-summary.survey-themed {
  background: var(--survey-background-color);
  border-color: var(--survey-border-color);
}

.analysis-title.survey-themed {
  color: var(--survey-primary-color) !important;
}

.chart-card.survey-themed {
  background: var(--survey-background-color);
  border: 2px solid var(--survey-primary-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.no-questions-selected.survey-themed {
  background: var(--survey-background-color);
  border: 1px solid var(--survey-border-color);
}

/* Estilos para el selector de preguntas */
.questions-selector {
  margin-bottom: var(--spacing-xl);
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.selector-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.selector-icon {
  font-size: 1.2rem;
}

.selector-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.question-item {
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  background: var(--bg-primary);
}

.question-item:hover {
  border-color: var(--survey-primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.question-checkbox {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  cursor: pointer;
  width: 100%;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.3s ease;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.question-info {
  flex: 1;
}

.question-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.4;
}

.question-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.question-type-badge {
  background: var(--primary-color);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  font-weight: 600;
}

.answers-count {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.selection-summary {
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  text-align: center;
}

.summary-text {
  color: var(--text-secondary);
  font-weight: 500;
}

/* Estilos para el contenedor de análisis */
.analysis-loaded {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.analysis-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.analysis-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.analysis-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.analysis-icon {
  font-size: 1.3rem;
}

.chart-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .analytics-view {
    padding: var(--spacing-md);
  }

  .survey-select {
    min-width: auto;
    width: 100%;
  }

  .selector-header {
    flex-direction: column;
    align-items: stretch;
  }

  .selector-actions {
    justify-content: center;
  }

  .question-checkbox {
    padding: var(--spacing-md);
  }

  .question-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .survey-meta {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .selected-survey-title {
    font-size: 1.5rem;
  }
}
</style>