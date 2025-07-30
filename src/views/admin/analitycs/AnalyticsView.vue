<!--
/**
 * Vista de analíticas avanzadas
 * @description Página para análisis estadísticos y métricas detalladas
 * @view AnalyticsView
 */
-->
<template>
  <div class="analytics-view">
    <!-- Header con selector de encuestas -->
    <header class="analytics-header card">
      <div class="flex flex-col gap-lg">
        <h1 class="page-title">
          Análisis de Encuestas
        </h1>

        <div class="survey-selector-container">
          <label for="survey-select" class="form-label">Seleccionar Encuesta:</label>
          <select id="survey-select" v-model="selectedSurveyId" class="form-input survey-select"
            :disabled="loadingSurveys" @change="loadAnalysis">
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
        <button class="btn btn-primary" @click="loadAnalysis">
          Reintentar
        </button>
      </div>

      <!-- Análisis cargado -->

      <div v-else-if="analysisData" class="analysis-container">
        <div v-for="question in analysisData.questionsAnalysis" :key="question.questionId">
          <ChartRenderer :question-data="question" />
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
import { ref, computed, onMounted } from 'vue'
import { useSurveyStore } from '../../../store/modules/survey'
import { surveyService } from '../../../services/survey.service'
import ChartRenderer from '../../../components/common/ChartRenderer.vue'

// Store y estado reactivo
const surveyStore = useSurveyStore()
const selectedSurveyId = ref<string>('')
const analysisData = ref<any>(null)
const loadingSurveys = ref(false)
const loadingAnalysis = ref(false)
const errorMessage = ref<string | null>(null)
const analysisError = ref<string | null>(null)

// Computed properties
const surveys = computed(() => surveyStore.surveys)


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
 * Carga el análisis de la encuesta seleccionada
 */
const loadAnalysis = async () => {
  if (!selectedSurveyId.value) {
    analysisData.value = null
    return
  }

  loadingAnalysis.value = true
  analysisError.value = null

  try {
    console.log(`📡 Cargando análisis para encuesta: ${selectedSurveyId.value}`)
    const response = await surveyService.getSurveyAnalysis(selectedSurveyId.value)
    analysisData.value = response.data
    console.log(`✅ Análisis cargado:`, analysisData.value)
  } catch (error: any) {
    console.error('❌ Error cargando análisis:', error)
    analysisError.value = error.response?.data?.message || 'Error al cargar el análisis'
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

.loading-state,
.error-state,
.empty-state {
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
  border-top: 4px solid var(--secondary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-lg);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error-icon,
.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

/* Sección de resumen */
.summary-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.summary-card {
  padding: var(--spacing-xl);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.summary-stats {
  display: flex;
  gap: var(--spacing-xl);
  justify-content: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--secondary-color);
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.types-card {
  padding: var(--spacing-xl);
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
}

.types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-md);
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.type-icon {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xs);
}

.type-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.type-name {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Análisis de preguntas */
.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: var(--spacing-lg);
}

.question-analysis-card {
  padding: var(--spacing-xl);
  border-left: 4px solid var(--secondary-color);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.question-type-badge {
  background: var(--primary-color);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  font-weight: 600;
}

.question-answers-count {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.question-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
}

.analysis-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

/* Análisis de texto */
.words-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.word-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--bg-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.word-text {
  font-weight: 500;
  color: var(--text-primary);
}

.word-count {
  background: var(--secondary-color);
  color: white;
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  font-weight: 600;
}

/* Análisis de opciones */
.options-chart {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.option-bar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.option-label {
  font-weight: 500;
  color: var(--text-primary);
}

.bar-container {
  position: relative;
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  height: 30px;
  border: 1px solid var(--border-color);
}

.bar-fill {
  background: linear-gradient(90deg, var(--secondary-color), var(--primary-color));
  height: 100%;
  border-radius: var(--border-radius);
  transition: width 0.5s ease;
}

.bar-label {
  position: absolute;
  right: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.9rem;
}

/* Análisis numérico */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--spacing-md);
}

.stat-box {
  background: var(--bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  text-align: center;
  border: 1px solid var(--border-color);
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: var(--spacing-xs);
}

.stat-name {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .analytics-view {
    padding: var(--spacing-md);
  }

  .summary-section {
    grid-template-columns: 1fr;
  }

  .questions-grid {
    grid-template-columns: 1fr;
  }

  .summary-stats {
    flex-direction: column;
    align-items: center;
  }

  .survey-select {
    min-width: auto;
    width: 100%;
  }
}

/* Animaciones */
.question-analysis-card {
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

.analysis-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 1rem;
}

/* Responsive para análisis */
@media (max-width: 768px) {
  .analysis-container {
    gap: 1rem;
  }
}
</style>